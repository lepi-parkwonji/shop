import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUtil } from './auth.util';
import { JwtAuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // isGlobal이어도 registerAsync에는 명시적으로 필요
      useFactory: (c: ConfigService) => ({ secret: c.get('JWT_SECRET'), signOptions: { expiresIn: '10h' } }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthUtil, JwtAuthGuard],
  exports: [JwtModule, AuthUtil, JwtAuthGuard],
})
export class AuthModule {}
