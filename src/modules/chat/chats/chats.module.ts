import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, Message, Participant } from '../chat.entities';
import { ParticipantsModule } from '../participants/participants.module';
import { ChatController } from './chats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Participant, Message ]),
    ParticipantsModule
  ],
  providers: [ChatsService],
  controllers: [ChatController],
  exports: [ChatsService]
})
export class ChatsModule {}