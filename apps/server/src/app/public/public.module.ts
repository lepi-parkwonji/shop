import { Module } from '@nestjs/common';
import { NoticeModule } from '../notice/notice.module';
import { FaqModule } from '../faq/faq.module';
import { InquiryModule } from '../inquiry/inquiry.module';
import { PublicController } from './public.controller';

@Module({
  imports: [NoticeModule, FaqModule, InquiryModule],
  controllers: [PublicController],
})
export class PublicModule {}
