import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Chat, Message, Participant } from "../chat.entities";
@Injectable()
export class ChatsService {

    constructor(
        @InjectRepository(Chat)
        private readonly chatRepo: Repository<Chat>,
        
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,

        private readonly dataSource: DataSource
    ) {}

    async createChat(type: string, title: string, userIds: string[]) {
        return await this.dataSource.transaction(async (manager) => {
            const chat = manager.create(Chat, { type, title });
            await manager.save(Chat, chat);

            const participants = userIds.map((uid) => manager.create(Participant, { chatId: chat.id, userId: uid }));
            await manager.save(Participant, participants);

            return chat;
        });
    }

    async getChatById(chatId: string) {
        const chat = await this.chatRepo.findOne({
            where: { id: chatId }
        });
        if (!chat) throw new BadRequestException("Chat not found");
        return chat;
    }

    async getChatsByUser(userId: string, page = 1, limit = 20) {
        const [chats, total] = await this.chatRepo
            .createQueryBuilder("chat")
            .innerJoin("chat.participants", "participant")
            .where("participant.userId = :userId", { userId })
            .orderBy("chat.updatedAt", "DESC")
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: chats,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getChatMessages(
        chatId: string,
        page = 1,
        limit = 50,
      ): Promise<{ data: Message[]; page: number; limit: number; total: number; totalPages: number }> {
        const [messages, total] = await this.messageRepo.findAndCount({
          where: { chatId: chatId },
          order: { createdAt: 'ASC' },
          skip: (page - 1) * limit,
          take: limit,
        });
    
        return {
          data: messages,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      }
}
