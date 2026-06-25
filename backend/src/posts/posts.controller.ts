import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../auth/jwt.strategy';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  feed(@CurrentUser() user: AuthUser | undefined, @Query('cursor') cursor?: string) {
    return this.postsService.feed(user?.id, cursor);
  }

  @UseGuards(JwtAuthGuard)
  @Get('following')
  followingFeed(
    @CurrentUser() user: AuthUser,
    @Query('cursor') cursor?: string,
  ) {
    return this.postsService.followingFeed(user.id, cursor);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser | undefined,
  ) {
    return this.postsService.findOne(id, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.postsService.remove(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.postsService.like(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.postsService.unlike(id, user.id);
  }
}
