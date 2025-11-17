// src/modules/graphic/models/models.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Model } from '../graphic.entities';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  findAll() {
    return this.modelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Model>) {
    return this.modelsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Model>) {
    return this.modelsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelsService.remove(id);
  }
}
