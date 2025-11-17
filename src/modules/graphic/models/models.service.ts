// src/modules/graphic/models/models.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model3D } from '../graphic.entities';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model3D)
    private readonly modelRepo: Repository<Model3D>,
  ) {}

  findAll() {
    return this.modelRepo.find({ relations: ['objects'] });
  }

  findOne(id: string) {
    return this.modelRepo.findOne({ where: { id }, relations: ['objects'] });
  }

  create(data: Partial<Model3D>) {
    const model = this.modelRepo.create(data);
    return this.modelRepo.save(model);
  }

  async update(id: string, data: Partial<Model3D>) {
    await this.modelRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.modelRepo.delete(id);
  }
}
