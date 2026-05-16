import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../app/admin/guards/admin-auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(AdminAuthGuard));
}
