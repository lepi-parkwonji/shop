import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AnswerInquiryDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '답변을 입력해주세요.' })
  @IsString()
  @MinLength(5, { message: '답변은 5자 이상 입력해주세요.' })
  @MaxLength(2000, { message: '답변은 2000자 이내로 입력해주세요.' })
  answer!: string;
}
