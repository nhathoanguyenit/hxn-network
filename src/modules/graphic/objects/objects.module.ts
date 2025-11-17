import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geometry, Material, Model, Object3D } from '../graphic.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, Object3D, Geometry, Material]),
  ],
  providers: [ObjectsService],
  controllers: [ObjectsController]
})
export class ObjectsModule {}
