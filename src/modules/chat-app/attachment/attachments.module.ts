import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { Attachment, Message } from '../chat-app.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, Message]),
  ],
  providers: [AttachmentsService],
  controllers: [AttachmentsController]
})
export class AttachmentsModule {}
