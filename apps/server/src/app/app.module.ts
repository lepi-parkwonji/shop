import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { GalleryModule } from './gallery/gallery.module';
import { PublicModule } from './public/public.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/server/.env',
    }),
    PrismaModule,
    AuthModule,
    AdminModule,
    NoticeModule,
    FaqModule,
    InquiryModule,
    GalleryModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
