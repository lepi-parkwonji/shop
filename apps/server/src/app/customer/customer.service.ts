import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthUtil } from '../auth/auth.util';
import { PrismaService } from '../../prisma/prisma.service';
import { TokensDTO } from '../../libs/dtos/tokens.dto';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

@Injectable()
export class CustomerService {
  constructor(
    private readonly authUtil: AuthUtil,
    private readonly prisma: PrismaService,
  ) {}

  getKakaoLoginUrl(redirectUri: string): { url: string } {
    const clientId = process.env.KAKAO_CLIENT_ID;
    if (!clientId) throw new Error('KAKAO_CLIENT_ID is not configured.');
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&prompt=login`;
    return { url };
  }

  async kakaoLogin(code: string, redirectUri: string): Promise<TokensDTO> {
    const clientId = process.env.KAKAO_CLIENT_ID;
    if (!clientId) throw new Error('KAKAO_CLIENT_ID is not configured.');

    try {
      const tokenRes = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        { grant_type: 'authorization_code', client_id: clientId, client_secret: process.env.KAKAO_CLIENT_SECRET, redirect_uri: redirectUri, code },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      const kakaoToken = tokenRes.data.access_token;

      const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${kakaoToken}` },
      });
      const profile = userRes.data;
      const kakaoId = String(profile.id);
      const nickname = profile.properties?.nickname ?? '카카오유저';
      const email: string | undefined = profile.kakao_account?.email;
      const profileImage: string | undefined = profile.properties?.profile_image;

      let customer = await this.prisma.customer.findUnique({ where: { oauthId: kakaoId } });
      if (!customer) {
        customer = await this.prisma.customer.create({
          data: { provider: 'KAKAO', oauthId: kakaoId, nickname, email, profileImage },
        });
      } else {
        customer = await this.prisma.customer.update({
          where: { id: customer.id },
          data: { nickname, email, profileImage },
        });
      }

      return {
        accessToken: this.authUtil.createToken({ sub: customer.id, type: 'CUSTOMER' }, ACCESS_TOKEN_EXPIRES_IN),
        refreshToken: this.authUtil.createToken({ sub: customer.id, type: 'CUSTOMER' }, REFRESH_TOKEN_EXPIRES_IN),
      };
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error('Kakao Login Error:', errorData ?? error.message);
      const errorMsg = errorData?.error_description || errorData?.msg || '카카오 로그인에 실패했습니다.';
      throw new UnauthorizedException(errorMsg);
    }
  }

  async signup(email: string, pass: string, nickname: string) {
    const existing = await this.prisma.customer.findUnique({ where: { email } });
    if (existing) throw new UnauthorizedException('이미 가입된 이메일입니다.');
    
    const password = await bcrypt.hash(pass, 10);
    await this.prisma.customer.create({
      data: { provider: 'LOCAL', email, password, nickname }
    });
    return { success: true };
  }

  async signin(email: string, pass: string): Promise<TokensDTO> {
    const customer = await this.prisma.customer.findUnique({ where: { email } });
    if (!customer || customer.provider !== 'LOCAL' || !customer.password) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    const isMatch = await bcrypt.compare(pass, customer.password);
    if (!isMatch) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    return {
      accessToken: this.authUtil.createToken({ sub: customer.id, type: 'CUSTOMER' }, ACCESS_TOKEN_EXPIRES_IN),
      refreshToken: this.authUtil.createToken({ sub: customer.id, type: 'CUSTOMER' }, REFRESH_TOKEN_EXPIRES_IN),
    };
  }

  async getMe(customerId: number) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return {
      id: customer.id,
      nickname: customer.nickname,
      email: customer.email ?? undefined,
      profileImage: customer.profileImage ?? undefined,
    };
  }
}
