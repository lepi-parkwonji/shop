import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Auth } from '../../libs/decorators/auth.decorator';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { ApiPaginatedResponse } from '../../libs/swagger/api-paginated-response.decorator';
import { ApiSearchQuery } from '../../libs/swagger/api-search-query.decorator';
import { AuthUtil } from '../auth/auth.util';
import { AnswerInquiryDTO } from './dtos/answer-inquiry.dto';
import { CreateInquiryDTO } from './dtos/create-inquiry.dto';
import { InquiryResponseDTO } from './dtos/inquiry-response.dto';
import { InquiryService } from './inquiry.service';

@ApiTags('inquiry')
@Controller('inquiry')
export class InquiryController {
  constructor(
    private inquiryService: InquiryService,
    private authUtil: AuthUtil,
  ) {}

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
  create(@Body() dto: CreateInquiryDTO, @Req() req: Request) {
    const token = this.authUtil.extractAccessTokenFromHeader(req);
    let customerId: number | undefined;
    if (token) {
      try {
        const payload = this.authUtil.verifyToken<{ sub: number }>(token);
        customerId = payload.sub;
      } catch {
        // 만료·유효하지 않은 토큰은 비로그인으로 처리
      }
    }
    return this.inquiryService.create(dto, customerId);
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
