import { Module } from '@nestjs/common';
import { ImageDetectionService } from './image-detection.service';
import { ImageDetectionController } from './image-detection.controller';

@Module({
  providers: [ImageDetectionService],
  controllers: [ImageDetectionController]
})
export class ImageDetectionModule {}
