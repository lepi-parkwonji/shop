import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '질문을 입력해주세요.' })
  @IsString()
  question: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '답변을 입력해주세요.' })
  @IsString()
  answer: string;
}
