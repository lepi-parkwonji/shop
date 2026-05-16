import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../libs/decorators/auth.decorator';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { ApiPaginatedResponse } from '../../libs/swagger/api-paginated-response.decorator';
import { ApiSearchQuery } from '../../libs/swagger/api-search-query.decorator';
import { FaqService } from './faq.service';
import { CreateFaqDTO } from './dtos/create-faq.dto';
import { UpdateFaqDTO } from './dtos/update-faq.dto';
import { FaqResponseDTO } from './dtos/faq-response.dto';

@ApiTags('faq')
@Controller('faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @ApiPaginatedResponse(FaqResponseDTO) @ApiSearchQuery()
  @Get('search')
  search(@Query() dto: OffsetSearchOptionDTO) {
    return this.faqService.search(dto);
  }

  @ApiOkResponse({ type: FaqResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOne(id);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: FaqResponseDTO }) @ApiBody({ type: CreateFaqDTO })
  @Post()
  @Auth()
  create(@Body() dto: CreateFaqDTO) {
    return this.faqService.create(dto);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: FaqResponseDTO }) @ApiBody({ type: UpdateFaqDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFaqDTO) {
    return this.faqService.update(id, dto);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: FaqResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.remove(id);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: FaqResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id/pin')
  @Auth()
  togglePin(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.togglePin(id);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: FaqResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id/expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.toggleExpose(id);
  }
}
