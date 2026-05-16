import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class KakaoLoginDto {
  @ApiProperty({ description: '카카오 인가 코드' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ description: '리다이렉트 URI' })
  @IsString()
  @IsNotEmpty()
  redirectUri!: string;
}
