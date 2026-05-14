import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInquiryDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString()
  @MinLength(2, { message: '제목은 2자 이상 입력해주세요.' })
  @MaxLength(100, { message: '제목은 100자 이내로 입력해주세요.' })
  title!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @IsString()
  @MinLength(10, { message: '내용은 10자 이상 입력해주세요.' })
  @MaxLength(2000, { message: '내용은 2000자 이내로 입력해주세요.' })
  content!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '작성자명을 입력해주세요.' })
  @IsString()
  @MinLength(2, { message: '작성자명은 2자 이상 입력해주세요.' })
  @MaxLength(20, { message: '작성자명은 20자 이내로 입력해주세요.' })
  authorName!: string;
}
