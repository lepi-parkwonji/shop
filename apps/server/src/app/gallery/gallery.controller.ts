import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from '../../libs/decorators/auth.decorator';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { ApiPaginatedResponse } from '../../libs/swagger/api-paginated-response.decorator';
import { ApiSearchQuery } from '../../libs/swagger/api-search-query.decorator';
import { CreateGalleryDTO } from './dtos/create-gallery.dto';
import { UpdateGalleryDTO } from './dtos/update-gallery.dto';
import { GalleryResponseDTO } from './dtos/gallery-response.dto';
import { GalleryService } from './gallery.service';

@ApiTags('gallery')
@ApiBearerAuth()
@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @ApiPaginatedResponse(GalleryResponseDTO) @ApiSearchQuery()
  @Get('search')
  @Auth()
  search(@Query() dto: OffsetSearchOptionDTO) {
    return this.galleryService.search(dto);
  }

  @ApiOkResponse({ type: GalleryResponseDTO })
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

  @ApiOkResponse({ type: GalleryResponseDTO }) @ApiBody({ type: UpdateGalleryDTO })
  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGalleryDTO) {
    return this.galleryService.update(id, dto);
  }

  @ApiOkResponse({ type: GalleryResponseDTO })
  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.remove(id);
  }

  @ApiOkResponse({ type: GalleryResponseDTO })
  @Patch(':id/expose')
  @Auth()
  toggleExpose(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.toggleExpose(id);
  }

  @ApiOkResponse({ schema: { properties: { eventNames: { type: 'array', items: { type: 'string' } } } } })
  @Get('event-names')
  @Auth()
  getEventNames() {
    return this.galleryService.getEventNames();
  }

  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ schema: { properties: { url: { type: 'string' } } } })
  @Post('upload/image')
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/gallery',
      filename: (_, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (_, file, cb) => {
      const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
      cb(null, allowed.test(file.originalname));
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/gallery/${file.filename}` };
  }
}
