import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, Participant } from '../chat.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant, Chat]),
  ],
  providers: [ParticipantsService],
  controllers: [],
  exports: [ParticipantsService]
})
export class ParticipantsModule {}
