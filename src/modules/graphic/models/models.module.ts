import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model3D } from '../graphic.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model3D]),
  ],
  providers: [ModelsService],
  controllers: [ModelsController]
})
export class ModelsModule {}
