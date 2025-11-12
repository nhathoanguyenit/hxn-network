import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message, MessageStatus, Participant } from '../chat.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageStatus, Participant]),
  ],
  providers: [MessagesService],
  controllers: [],
  exports: [MessagesService]
})
export class MessagesModule {}
