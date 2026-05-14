import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../libs/decorators/auth.decorator';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { ApiPaginatedResponse } from '../../libs/swagger/api-paginated-response.decorator';
import { ApiSearchQuery } from '../../libs/swagger/api-search-query.decorator';
import { NoticeService } from './notice.service';
import { CreateNoticeDTO } from './dtos/create-notice.dto';
import { UpdateNoticeDTO } from './dtos/update-notice.dto';
import { NoticeResponseDTO } from './dtos/notice-response.dto';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @ApiPaginatedResponse(NoticeResponseDTO) @ApiSearchQuery()
  @Get('search')
  search(@Query() dto: OffsetSearchOptionDTO) {
    return this.noticeService.search(dto);
  }

  @ApiOkResponse({ type: NoticeResponseDTO })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.findOne(id);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: NoticeResponseDTO }) @ApiBody({ type: CreateNoticeDTO })
  @Post()
  @Auth()
  create(@Body() dto: CreateNoticeDTO) {
    return this.noticeService.create(dto);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: NoticeResponseDTO }) @ApiBody({ type: UpdateNoticeDTO })
  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoticeDTO) {
    return this.noticeService.update(id, dto);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: NoticeResponseDTO })
  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.remove(id);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: NoticeResponseDTO })
  @Patch(':id/pin')
  @Auth()
  togglePin(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.togglePin(id);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: NoticeResponseDTO })
  @Patch(':id/expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.toggleExpose(id);
  }
}
