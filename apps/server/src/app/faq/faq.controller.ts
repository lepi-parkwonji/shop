import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Auth } from '../../libs/decorators/auth.decorator';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { FaqService } from './faq.service';
import { CreateFaqDTO } from './dtos/create-faq.dto';
import { UpdateFaqDTO } from './dtos/update-faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Get('search')
  search(@Query() dto: OffsetSearchOptionDTO) {
    return this.faqService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOne(id);
  }

  @Post()
  @Auth()
  create(@Body() dto: CreateFaqDTO) {
    return this.faqService.create(dto);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFaqDTO) {
    return this.faqService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.remove(id);
  }

  @Patch(':id/pin')
  @Auth()
  togglePin(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.togglePin(id);
  }

  @Patch(':id/expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.toggleExpose(id);
  }
}
