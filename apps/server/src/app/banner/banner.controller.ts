import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../libs/decorators/auth.decorator';
import { BannerService } from './banner.service';
import { BannerType, CreateBannerDto, UpdateBannerDto } from './dtos/banner.dto';

@ApiTags('banner')
@ApiBearerAuth()
@Controller('banners')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get()
  @Auth()
  findAll(@Query('type') type?: BannerType) {
    return this.bannerService.findAll(type);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.findOne(id);
  }

  @Post()
  @Auth()
  create(@Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
    return this.bannerService.update(id, dto);
  }

  @Patch(':id/toggle-expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.toggleExpose(id);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.remove(id);
  }
}
