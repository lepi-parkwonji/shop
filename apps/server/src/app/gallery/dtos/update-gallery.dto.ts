import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateGalleryDTO {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '갤러리명은 2자 이상 입력해주세요.' })
  @MaxLength(100, { message: '갤러리명은 100자 이내로 입력해주세요.' })
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: '내용은 5000자 이내로 입력해주세요.' })
  content?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: '올바른 URL을 입력해주세요.' })
  videoUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '행사명은 100자 이내로 입력해주세요.' })
  eventName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  shootingDate?: string;
}
