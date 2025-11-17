import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geometry, Material, Model, Object3D } from '../graphic.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, Object3D, Geometry, Material]),
  ],
  providers: [ModelsService],
  controllers: [ModelsController]
})
export class ModelsModule {}
