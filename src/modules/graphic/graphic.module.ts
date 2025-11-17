import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  providers: [],
  controllers: [],
  imports: [ModelsModule, ObjectsModule]
})
export class GraphicModule {}
