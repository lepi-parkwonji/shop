import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUtil } from '../auth.util';
import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  admin?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authUtil: AuthUtil) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as AuthRequest;
    const token = this.authUtil.extractAccessTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    const payload = this.authUtil.verifyToken<JwtPayload>(token);
    request['admin'] = payload;
    return true;
  }
}
