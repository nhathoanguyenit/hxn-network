import { Injectable, ConflictException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Chat, Participant } from "../chat-app.entities";

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,

    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>
    
  ) {}

  async ensureUserInChat(chatId: string, userId: string): Promise<void> {

    const exists = await this.participantRepo.exists({
      where: { chatId: chatId, userId: userId },
    });

    if (!exists) {
      throw new ForbiddenException(`User ${userId} is not a member of chat ${chatId}`);
    }
  }

  
  async addParticipant(chatId: string, userId: string, isAdmin = false) {
    const exists = await this.participantRepo.exists({ where: { chatId: chatId, userId: userId } });
    if (exists) throw new ConflictException("User already in chat");

    const participant = this.participantRepo.create({ chatId: chatId, userId: userId, isAdmin: isAdmin });
    return this.participantRepo.save(participant);
  }

  async getChatParticipantsByChatId(chatId: string) {
    return this.participantRepo.find({ where: { chatId: chatId } });
  }

  async getParticipant(chatId: string, userId: string): Promise<Participant | null> {
    return this.participantRepo.findOne({
      where: { chatId: chatId, userId: userId },
    });
  }

  async removeParticipant(chatId: string, userId: string) {
    await this.participantRepo.delete({ chatId: chatId, userId: userId });
  }
}
