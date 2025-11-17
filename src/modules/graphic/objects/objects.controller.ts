// src/modules/graphic/objects/objects.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { Object3D } from '../graphic.entities';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get()
  findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Object3D>) {
    return this.objectsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Object3D>) {
    return this.objectsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objectsService.remove(id);
  }
}
