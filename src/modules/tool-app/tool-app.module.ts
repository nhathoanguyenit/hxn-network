import { Module } from '@nestjs/common';
import { ToolAppService } from './tool-app.service';
import { ToolAppController } from './tool-app.controller';
import { ImageDetectionModule } from './image-detection/image-detection.module';

@Module({
  providers: [ToolAppService],
  controllers: [ToolAppController],
  imports: [ImageDetectionModule]
})
export class ToolAppModule {}
