import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

@Module({
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (req: any, file: any, cb:any) => cb(null, uploadDir),
        filename: (req: any, file: any, cb: any) =>
          cb(null, Date.now() + '-' + file.originalname),
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
