import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { MediaType } from '@prisma/client';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;

  @IsUrl({ require_tld: false })
  mediaUrl!: string;

  @IsEnum(MediaType)
  mediaType!: MediaType;

  @IsOptional()
  @IsUrl({ require_tld: false })
  thumbnailUrl?: string;
}
