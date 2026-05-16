import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ description: '닉네임' })
  @IsString()
  @IsNotEmpty()
  nickname!: string;
}
