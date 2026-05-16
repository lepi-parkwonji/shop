import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../libs/decorators/auth.decorator';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { ApiPaginatedResponse } from '../../libs/swagger/api-paginated-response.decorator';
import { ApiSearchQuery } from '../../libs/swagger/api-search-query.decorator';
import { AnswerInquiryDTO } from './dtos/answer-inquiry.dto';
import { CreateInquiryDTO } from './dtos/create-inquiry.dto';
import { InquiryResponseDTO } from './dtos/inquiry-response.dto';
import { InquiryService } from './inquiry.service';

@ApiTags('inquiry')
@Controller('inquiry')
export class InquiryController {
  constructor(private inquiryService: InquiryService) {}

  @ApiBearerAuth() @ApiPaginatedResponse(InquiryResponseDTO) @ApiSearchQuery()
  @Get('search')
  @Auth()
  search(@Query() dto: OffsetSearchOptionDTO) {
    return this.inquiryService.search(dto);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: InquiryResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inquiryService.findOne(id);
  }

  @ApiOkResponse({ type: InquiryResponseDTO }) @ApiBody({ type: CreateInquiryDTO })
  @Post()
  create(@Body() dto: CreateInquiryDTO) {
    return this.inquiryService.create(dto);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: InquiryResponseDTO }) @ApiBody({ type: AnswerInquiryDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id/answer')
  @Auth()
  answer(@Param('id', ParseIntPipe) id: number, @Body() dto: AnswerInquiryDTO) {
    return this.inquiryService.answer(id, dto);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: InquiryResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id/expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.inquiryService.toggleExpose(id);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: InquiryResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inquiryService.remove(id);
  }
}
