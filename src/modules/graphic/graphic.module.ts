import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';

@Module({
  providers: [],
  controllers: [],
  imports: [ModelsModule]
})
export class GraphicModule {}
