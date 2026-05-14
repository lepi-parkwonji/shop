import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNoticeDTO {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}
