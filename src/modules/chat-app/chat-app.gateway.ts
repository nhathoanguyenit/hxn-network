import { Logger, Injectable, UseGuards, UnauthorizedException } from "@nestjs/common";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as cookie from "cookie";
import { JwtService } from "@nestjs/jwt";
import { ChatsService } from "./chats/chats.service";
import { ParticipantsService } from "./participants/participants.service";
import { MessagesService } from "./messages/messages.service";
import { MessageStatusesService } from "./message-statuses/message-statuses.service";
import { WsJwtGuard } from "@common/guards/ws-jwt.guard";
import { Ack } from "@common/utils/ack.helper";

@WebSocketGateway({
  namespace: "/chat",
  cors: {
    origin: true,
    credentials: true,
  },
})
@Injectable()
export class ChatAppSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatAppSocketGateway.name);
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatsService: ChatsService,
    private readonly participantsService: ParticipantsService,
    private readonly messagesService: MessagesService,
    private readonly messageStatusesService: MessageStatusesService
  ) {}

  afterInit() {
    this.logger.log("✅ Chat Gateway initialized.");
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) throw new UnauthorizedException("Missing token");

      const payload = this.jwtService.verify(token);
      (client as any).user = payload;

      this.connectedUsers.set(client.id, payload.sub);
      this.logger.log(`⚡ ${payload.fullname} connected (${client.id})`);
      client.emit("authenticated", { user: payload });
    } catch (err) {
      this.logger.warn(`Unauthorized client ${client.id}: ${err.message}`);
      client.emit("unauthorized", { message: "Invalid or missing token" });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.logger.log(`❌ User ${userId} disconnected`);
      this.connectedUsers.delete(client.id);
    }
  }

  private extractToken(client: Socket): string | null {
    const headerAuth = client.handshake.headers.authorization;
    if (headerAuth?.startsWith("Bearer ")) return headerAuth.substring(7);

    const cookieHeader = client.handshake.headers.cookie;
    if (cookieHeader) {
      const parsed = cookie.parse(cookieHeader);
      return parsed["jwt"] || null;
    }
    return null;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("join_chat")
  async handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    const user = (client as any).user;
    const chat = await this.chatsService.getChatById(data.chatId);

    if (chat.type !== 'public') {
      await this.participantsService.ensureUserInChat(chat.id, user.sub);
    }

    client.join(data.chatId);
    client.emit("joined_chat", chat);
    this.logger.log(`👥 ${user.fullname} joined chat ${chat.title}`);
    return Ack.ok();
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("send_message")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; content: string; replyTo?: string }
  ) {
    const user = (client as any).user;
    const chat = await this.chatsService.getChatById(data.chatId);
    
    if (chat.type !== 'public') {
      await this.participantsService.ensureUserInChat(chat.id, user.sub);
    }

    const message = await this.messagesService.sendMessage(chat.id, user.sub, user.fullname, data.content, data.replyTo);

    this.server.to(data.chatId).emit("new_message", {
      id: message.id,
      chatId: data.chatId,
      senderId: user.sub,
      senderName: user.fullname,
      content: message.content,
      createdAt: message.createdAt,
    });

    this.logger.log(`💬 ${user.fullname} sent message in chat ${data.chatId}`);
    return Ack.ok();
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("read_message")
  async handleReadMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { messageId: string }) {
    const user = (client as any).user;

    await this.messageStatusesService.markAsRead(data.messageId, user.sub);

    this.server.emit("message_read", {
      messageId: data.messageId,
      userId: user.sub,
      readAt: new Date(),
    });

    this.logger.log(`✅ User ${user.fullname} read message ${data.messageId}`);
    return Ack.ok();
  }

  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  sendTo(socketId: string, event: string, payload: any) {
    this.server.to(socketId).emit(event, payload);
  }

  toRoom(room: string, event: string, payload: any) {
    this.server.to(room).emit(event, payload);
  }

  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
      const response = { ...payload, serverTime: Date.now() };
      client.emit("pong", response);
  }
}
