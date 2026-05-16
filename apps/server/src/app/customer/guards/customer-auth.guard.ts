import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUtil } from '../../auth/auth.util';
import { Request } from 'express';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(private authUtil: AuthUtil) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const token = this.authUtil.extractAccessTokenFromHeader(req);
    if (!token) throw new UnauthorizedException();
    req.user = this.authUtil.verifyToken(token);
    return true;
  }
}
