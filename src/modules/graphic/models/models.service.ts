// src/modules/graphic/models/models.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from '../graphic.entities';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepo: Repository<Model>,
  ) {}

  findAll() {
    return this.modelRepo.find({ relations: ['objects'] });
  }

  findOne(id: string) {
    return this.modelRepo.findOne({ where: { id }, relations: ['objects'] });
  }

  create(data: Partial<Model>) {
    const model = this.modelRepo.create(data);
    return this.modelRepo.save(model);
  }

  async update(id: string, data: Partial<Model>) {
    await this.modelRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.modelRepo.delete(id);
  }
}
