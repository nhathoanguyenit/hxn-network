import {
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import type { Response } from 'express';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('image')
  @Render('upload')
  uploadForm() {
    return { title: 'Upload File' };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) return res.send('No file uploaded.');
    try {
      const filename = await this.uploadService.uploadImage(file);
      res.send(`
          <p>Ảnh đã được upload & nén thành công: <b>${filename}</b></p>
          <a href="/upload/image" class="btn btn-link mt-3">Back</a>
          <img src="/uploads/${filename}" width="300"/>
        `);
    } catch (err) {
      console.error(err);
      res.status(500).send('Có lỗi xảy ra khi nén ảnh.');
    }
  }
}
