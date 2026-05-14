import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Auth } from '../../libs/decorators/auth.decorator';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { NoticeService } from './notice.service';
import { CreateNoticeDTO } from './dtos/create-notice.dto';
import { UpdateNoticeDTO } from './dtos/update-notice.dto';

@Controller('notice')
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @Get('search')
  search(@Query() dto: OffsetSearchOptionDTO) {
    return this.noticeService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.findOne(id);
  }

  @Post()
  @Auth()
  create(@Body() dto: CreateNoticeDTO) {
    return this.noticeService.create(dto);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoticeDTO) {
    return this.noticeService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.remove(id);
  }

  @Patch(':id/pin')
  @Auth()
  togglePin(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.togglePin(id);
  }

  @Patch(':id/expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.toggleExpose(id);
  }
}
