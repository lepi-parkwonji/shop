import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { Request } from 'express';
import { TokenExpiredException } from './exception/token-expired.exception';

@Injectable()
export class AuthUtil {
  constructor(private readonly jwtService: JwtService) {}

  createToken<T extends object>(payload: T, expiresIn: string | number): string {
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    });
  }

  verifyToken<T extends object>(token: string): T {
    try {
      return this.jwtService.verify<T>(token);
    } catch (error) {
      if (error instanceof Error && error.message === 'jwt expired')
        throw new TokenExpiredException();
      throw new BadRequestException('잘못된 요청입니다.');
    }
  }

  compareHash(plain: string, hash: string): boolean {
    return compareSync(plain, hash);
  }

  extractAccessTokenFromHeader(request: Request): string | null {
    const authorization = request.headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) return null;
    return authorization.split(' ')[1];
  }
}
