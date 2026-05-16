import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerAuthGuard } from './guards/customer-auth.guard';
import { CustomerService } from './customer.service';
import type { Request } from 'express';

import { KakaoLoginDto, SigninDto } from './dtos/customer-sign-in.dto';
import { SignupDto } from './dtos/customer-sign-up.dto';
import { CustomerDTO } from './dtos/customer.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Client')
@Controller('client')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('auth/kakao-url')
  getKakaoLoginUrl(@Query('redirectUri') redirectUri: string) {
    return this.customerService.getKakaoLoginUrl(redirectUri);
  }

  @Post('auth/kakao')
  kakaoLogin(@Body() body: KakaoLoginDto) {
    return this.customerService.kakaoLogin(body.code, body.redirectUri);
  }

  @Post('auth/signup')
  signup(@Body() body: SignupDto) {
    return this.customerService.signup(body.email, body.password, body.nickname);
  }

  @Post('auth/signin')
  signin(@Body() body: SigninDto) {
    return this.customerService.signin(body.email, body.password);
  }

  @UseGuards(CustomerAuthGuard)
  @ApiOkResponse({ type: CustomerDTO })
  @Get('me')
  getMe(@Req() req: Request & { user: { sub: number } }) {
    return this.customerService.getMe(req.user.sub);
  }

  @UseGuards(CustomerAuthGuard)
  @Post('logout')
  logout() {
    return { success: true };
  }
}
