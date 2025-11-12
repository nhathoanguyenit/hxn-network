import { Module } from '@nestjs/common';
import { ToolAppService } from './tool.service';
import { ToolAppController } from './tool.controller';
import { ImageDetectionModule } from './image-detection/image-detection.module';

@Module({
  providers: [ToolAppService],
  controllers: [ToolAppController],
  imports: [ImageDetectionModule]
})
export class ToolModule {}
