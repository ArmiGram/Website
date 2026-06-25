import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../auth/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.usersService.search(q);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':username')
  getProfile(
    @Param('username') username: string,
    @CurrentUser() user: AuthUser | undefined,
  ) {
    return this.usersService.getProfile(username, user?.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':username/posts')
  getUserPosts(
    @Param('username') username: string,
    @CurrentUser() user: AuthUser | undefined,
  ) {
    return this.usersService.getUserPosts(username, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/follow')
  follow(@Param('username') username: string, @CurrentUser() user: AuthUser) {
    return this.usersService.follow(user.id, username);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/follow')
  unfollow(@Param('username') username: string, @CurrentUser() user: AuthUser) {
    return this.usersService.unfollow(user.id, username);
  }
}
