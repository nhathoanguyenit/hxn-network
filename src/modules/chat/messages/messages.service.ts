import { Injectable, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Message, MessageStatus, Participant } from "../chat.entities";

@Injectable()
export class MessagesService {

    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,

        @InjectRepository(MessageStatus)
        private readonly statusRepo: Repository<MessageStatus>,

        private readonly dataSource: DataSource
    ) {}

    async sendMessage(chatId: string, senderId: string, senderName: string,  content: string, replyTo?: string) {

        return await this.dataSource.transaction(async (manager) => {
            // 1️⃣ Create message
            const message = manager.create(Message, {
                chatId: chatId,
                senderId: senderId,
                senderName: senderName,
                content,
                replyTo: replyTo ?? undefined,
            });
            await manager.save(Message, message);

            // 2️⃣ Create statuses for all chat participants
            const participants = await manager.find(Participant, { where: { chatId: chatId } });
            const statuses = participants.map((p) =>
                manager.create(MessageStatus, { messageId: message.id, userId: p.userId })
            );
            await manager.save(MessageStatus, statuses);

            return message;
        });
    }

    async getChatMessages(chatId: string) {
        return this.messageRepo.find({
            where: { chatId: chatId },
            relations: ["attachments", "statuses"],
            order: { createdAt: "ASC" },
        });
    }

    async markAsDelivered(messageId: string, userId: string) {
        await this.statusRepo.update({ messageId: messageId, userId: userId }, { deliveredAt: new Date() });
    }

    async markAsRead(messageId: string, userId: string) {
        await this.statusRepo.update({ messageId: messageId, userId: userId }, { readAt: new Date() });
    }

    async getMessageById(messageId: string) {
        const msg = await this.messageRepo.findOne({
            where: { id: messageId },
            relations: ["attachments", "statuses"],
        });
        if (!msg) throw new BadRequestException("Message not found");
        return msg;
    }

    async getMessagesByChatId(
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
