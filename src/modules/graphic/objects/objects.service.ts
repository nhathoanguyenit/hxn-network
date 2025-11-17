// src/modules/graphic/objects/objects.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Object3D } from '../graphic.entities';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(Object3D)
    private readonly objectRepo: Repository<Object3D>,
  ) {}

  findAll() {
    return this.objectRepo.find({ relations: ['geometries', 'materials'] });
  }

  findOne(id: string) {
    return this.objectRepo.findOne({ where: { id }, relations: ['geometries', 'materials'] });
  }

  create(data: Partial<Object3D>) {
    const obj = this.objectRepo.create(data);
    return this.objectRepo.save(obj);
  }

  async update(id: string, data: Partial<Object3D>) {
    await this.objectRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.objectRepo.delete(id);
  }
}
