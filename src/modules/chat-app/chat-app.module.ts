import { Module } from "@nestjs/common";
import { ChatsModule } from "./chats/chats.module";
import { ChatAppSocketGateway } from "./chat-app.gateway";
import { ParticipantsModule } from './participants/participants.module';
import { MessagesModule } from './messages/messages.module';
import { MessageStatusesModule } from './message-statuses/message-statuses.module';
import { AttachmentsModule } from './attachment/attachments.module';

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
    providers: [ChatAppSocketGateway],
    controllers: []
})
export class ChatAppModule {}
