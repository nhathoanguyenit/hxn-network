import { Module } from '@nestjs/common';
import { PinyinController } from './pinyin.controller';
import { PinyinService } from './pinyin.service';
import { PinyinSocketGateway } from './pinyin.gateway';

@Module({
  controllers: [PinyinController],
  providers: [PinyinService, PinyinSocketGateway]
})
export class PinyinModule {}
