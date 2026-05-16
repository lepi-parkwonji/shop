import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { GalleryModule } from './gallery/gallery.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ExhibitorModule } from './exhibitor/exhibitor.module';
import { PublicModule } from './public/public.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';
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
    ScheduleModule,
    ExhibitorModule,
    PublicModule,
    CustomerModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
