import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoticeDTO {
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageURL?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
