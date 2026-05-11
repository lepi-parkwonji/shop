import { IsNotEmpty, IsString } from 'class-validator';

export class AdminSignInDTO {
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  @IsString()
  usrname: string; 

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  password: string;
}
