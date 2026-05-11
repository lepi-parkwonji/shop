import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { NoticeService } from '../notice/notice.service';
import { FaqService } from '../faq/faq.service';

@Controller('public')
export class PublicController {
  constructor(
    private noticeService: NoticeService,
    private faqService: FaqService,
  ) {}

  @Get('notices')
  searchNotices(@Query() dto: OffsetSearchOptionDTO) {
    return this.noticeService.searchPublic(dto);
  }

  @Get('notices/:id')
  findOneNotice(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.findOnePublic(id);
  }

  @Get('faqs')
  searchFaqs(@Query() dto: OffsetSearchOptionDTO) {
    return this.faqService.searchPublic(dto);
  }

  @Get('faqs/:id')
  findOneFaq(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOnePublic(id);
  }
}
