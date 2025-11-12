import { Module } from "@nestjs/common";
import { ChatsModule } from "./chats/chats.module";
import { ChatSocketGateway } from "./chat.gateway";
import { ParticipantsModule } from './participants/participants.module';
import { MessagesModule } from './messages/messages.module';
import { MessageStatusesModule } from './message-statuses/message-statuses.module';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
    imports: [
        ChatsModule,
        ParticipantsModule,
        MessagesModule,
        ParticipantsModule,
        MessagesModule,
        MessageStatusesModule,
        AttachmentsModule,
    ],
    providers: [ChatSocketGateway],
    controllers: []
})
export class ChatModule {}
