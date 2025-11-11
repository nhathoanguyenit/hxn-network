import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { MessageStatus, Participant } from "../chat-app.entities";

@Injectable()
export class MessageStatusesService {
  constructor(
    @InjectRepository(MessageStatus)
    private readonly messaageRepo: Repository<MessageStatus>,

    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>
    
  ) {}

  async createForAllParticipants(chatId: string, messageId: string) {
    const participants = await this.participantRepo.find({ where: { chatId: chatId } });
    const statuses = participants.map((p) =>
      this.messaageRepo.create({ messageId: messageId, userId: p.userId }),
    );
    await this.messaageRepo.save(statuses);
  }

  async markAsDelivered(messageId: string, userId: string) {
    await this.messaageRepo.update(
      { messageId: messageId, userId: userId },
      { deliveredAt: new Date() },
    );
  }

  async markAsRead(messageId: string, userId: string) {
    await this.messaageRepo.update(
      { messageId: messageId, userId: userId },
      { readAt: new Date() },
    );
  }
}
