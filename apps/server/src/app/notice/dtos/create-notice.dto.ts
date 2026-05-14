import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoticeDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString()
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}
