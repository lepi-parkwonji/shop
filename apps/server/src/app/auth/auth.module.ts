import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUtil } from './auth.util';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({ secret: config.get('JWT_SECRET'), signOptions: { expiresIn: '10h' } }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthUtil],
  exports: [JwtModule, AuthUtil],
})
export class AuthModule {}
