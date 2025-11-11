import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { JwtGuard } from "@common/guards/jwt.guard";
import { ChatsService } from "./chats.service";
import { MessagesService } from "../messages/messages.service";

@Controller("api/chat-app/chats")
export class ChatController {
    constructor(
        private readonly chatsService: ChatsService
    ) {}
    
    @UseGuards(JwtGuard)
    @Get()
    async getUserChats(@Req() req: any, @Query("page") page = "1", @Query("limit") limit = "20") {
        const userId = req.user.sub;
        const pageNum = Math.max(parseInt(page, 10), 1);
        const limitNum = Math.min(parseInt(limit, 10), 100);

        return this.chatsService.getChatsByUser(userId, pageNum, limitNum);
    }

    @Get(":chatId")
    async getChat(@Param("chatId") chatId: string) {
        return this.chatsService.getChatById(chatId);
    }

    @Get(":chatId/messages")
    async getMessages(@Param("chatId") chatId: string) {
        return this.chatsService.getChatMessages(chatId); 
    }
}
