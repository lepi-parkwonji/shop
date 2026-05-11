import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUtil } from '../auth.util';
import { Request } from 'express';

interface AuthRequest extends Request {
  admin?: unknown;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authUtil: AuthUtil) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as AuthRequest;
    const token = this.authUtil.extractAccessTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    const payload = this.authUtil.verifyToken(token);
    request['admin'] = payload;
    return true;
  }
}
