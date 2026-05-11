import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDTO {
  @IsNotEmpty({ message: '질문을 입력해주세요.' })
  @IsString()
  question: string;

  @IsNotEmpty({ message: '답변을 입력해주세요.' })
  @IsString()
  answer: string;
}
