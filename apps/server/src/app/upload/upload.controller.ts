import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from '../../libs/decorators/auth.decorator';

@ApiTags('upload')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ schema: { properties: { url: { type: 'string' } } } })
  @Post('image')
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/content',
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
    return { url: `/uploads/content/${file.filename}` };
  }
}
