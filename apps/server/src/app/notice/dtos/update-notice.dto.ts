import { IsOptional, IsString } from 'class-validator';

export class UpdateNoticeDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  imageURL?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
