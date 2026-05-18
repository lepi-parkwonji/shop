import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Auth } from '../../libs/decorators/auth.decorator';
import { ApiPaginatedResponse } from '../../libs/swagger/api-paginated-response.decorator';
import { ApiSearchQuery } from '../../libs/swagger/api-search-query.decorator';
import { CreateGalleryDTO } from './dtos/create-gallery.dto';
import { UpdateGalleryDTO } from './dtos/update-gallery.dto';
import { GalleryResponseDTO } from './dtos/gallery-response.dto';
import { GallerySearchOptionDTO } from './dtos/gallery-search-option.dto';
import { GalleryService } from './gallery.service';
import { SupabaseService } from '../supabase/supabase.service';

@ApiTags('gallery')
@ApiBearerAuth()
@Controller('gallery')
export class GalleryController {
  constructor(
    private galleryService: GalleryService,
    private supabase: SupabaseService,
  ) {}

  @ApiPaginatedResponse(GalleryResponseDTO) @ApiSearchQuery()
  @Get('search')
  @Auth()
  search(@Query() dto: GallerySearchOptionDTO) {
    return this.galleryService.search(dto);
  }

  @ApiOkResponse({ schema: { properties: { eventNames: { type: 'array', items: { type: 'string' } } } } })
  @Get('event-names')
  @Auth()
  getEventNames() {
    return this.galleryService.getEventNames();
  }

  @ApiOkResponse({ type: GalleryResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.findOne(id);
  }

  @ApiOkResponse({ type: GalleryResponseDTO }) @ApiBody({ type: CreateGalleryDTO })
  @Post()
  @Auth()
  create(@Body() dto: CreateGalleryDTO) {
    return this.galleryService.create(dto);
  }

  @ApiOkResponse({ type: GalleryResponseDTO }) @ApiBody({ type: UpdateGalleryDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGalleryDTO) {
    return this.galleryService.update(id, dto);
  }

  @ApiOkResponse({ type: GalleryResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.remove(id);
  }

  @ApiOkResponse({ type: GalleryResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id/expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.toggleExpose(id);
  }

  @ApiOkResponse({ type: GalleryResponseDTO }) @ApiParam({ name: 'id', type: Number })
  @Patch(':id/pin')
  @Auth()
  togglePin(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.togglePin(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ schema: { properties: { url: { type: 'string' } } } })
  @Post('upload/image')
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    fileFilter: (_, file, cb) => cb(null, /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname)),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.supabase.uploadFile('gallery', file.originalname, file.buffer, file.mimetype);
    return { url };
  }
}
