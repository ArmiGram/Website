import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(username: string, viewerId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let isFollowing = false;
    if (viewerId && viewerId !== user.id) {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: viewerId,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    const { _count, ...rest } = user;
    return {
      ...rest,
      postCount: _count.posts,
      followerCount: _count.followers,
      followingCount: _count.following,
      isFollowing,
      isMe: viewerId === user.id,
    };
  }

  async getUserPosts(username: string, viewerId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const posts = await this.prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
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
      },
    });
    return posts.map((p) => {
      const { _count, likes, ...rest } = p;
      return {
        ...rest,
        likeCount: _count.likes,
        commentCount: _count.comments,
        likedByMe: Array.isArray(likes) ? likes.length > 0 : false,
      };
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: dto.displayName,
        bio: dto.bio,
        avatarUrl: dto.avatarUrl,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
      },
    });
  }

  async follow(viewerId: string, username: string) {
    const target = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });
    if (!target) {
      throw new NotFoundException('User not found');
    }
    if (target.id === viewerId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: viewerId,
          followingId: target.id,
        },
      },
      create: { followerId: viewerId, followingId: target.id },
      update: {},
    });
    return { following: true };
  }

  async unfollow(viewerId: string, username: string) {
    const target = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });
    if (!target) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.follow
      .delete({
        where: {
          followerId_followingId: {
            followerId: viewerId,
            followingId: target.id,
          },
        },
      })
      .catch(() => undefined);
    return { following: false };
  }

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query.toLowerCase(), mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    });
  }
}
