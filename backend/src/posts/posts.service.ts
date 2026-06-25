import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private postSelect(viewerId?: string) {
    return {
      id: true,
      caption: true,
      mediaUrl: true,
      mediaType: true,
      thumbnailUrl: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      _count: { select: { likes: true, comments: true } },
      likes: viewerId
        ? { where: { userId: viewerId }, select: { id: true } }
        : false,
    } satisfies Prisma.PostSelect;
  }

  private shape(post: any) {
    const { _count, likes, ...rest } = post;
    return {
      ...rest,
      likeCount: _count.likes,
      commentCount: _count.comments,
      likedByMe: Array.isArray(likes) ? likes.length > 0 : false,
    };
  }

  async create(authorId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        authorId,
        caption: dto.caption,
        mediaUrl: dto.mediaUrl,
        mediaType: dto.mediaType,
        thumbnailUrl: dto.thumbnailUrl,
      },
      select: this.postSelect(authorId),
    });
    return this.shape(post);
  }

  async feed(viewerId: string | undefined, cursor?: string, take = 10) {
    const posts = await this.prisma.post.findMany({
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      select: this.postSelect(viewerId),
    });

    let nextCursor: string | null = null;
    if (posts.length > take) {
      const next = posts.pop();
      nextCursor = next ? next.id : null;
    }

    return {
      items: posts.map((p) => this.shape(p)),
      nextCursor,
    };
  }

  async followingFeed(viewerId: string, cursor?: string, take = 10) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: viewerId },
      select: { followingId: true },
    });
    const authorIds = following.map((f) => f.followingId);
    authorIds.push(viewerId);

    const posts = await this.prisma.post.findMany({
      where: { authorId: { in: authorIds } },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      select: this.postSelect(viewerId),
    });

    let nextCursor: string | null = null;
    if (posts.length > take) {
      const next = posts.pop();
      nextCursor = next ? next.id : null;
    }

    return {
      items: posts.map((p) => this.shape(p)),
      nextCursor,
    };
  }

  async findOne(id: string, viewerId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: this.postSelect(viewerId),
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.shape(post);
  }

  async remove(id: string, viewerId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== viewerId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.prisma.post.delete({ where: { id } });
    return { success: true };
  }

  async like(postId: string, userId: string) {
    await this.ensurePostExists(postId);
    await this.prisma.like.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId },
      update: {},
    });
    const likeCount = await this.prisma.like.count({ where: { postId } });
    return { liked: true, likeCount };
  }

  async unlike(postId: string, userId: string) {
    await this.ensurePostExists(postId);
    await this.prisma.like
      .delete({ where: { postId_userId: { postId, userId } } })
      .catch(() => undefined);
    const likeCount = await this.prisma.like.count({ where: { postId } });
    return { liked: false, likeCount };
  }

  private async ensurePostExists(postId: string) {
    const exists = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Post not found');
    }
  }
}
