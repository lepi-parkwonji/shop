import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../app/auth/guards/auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
