import { Module } from "@nestjs/common";
import { MessageStatusesService } from "./message-statuses.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageStatus, Participant } from "../chat.entities";

@Module({
    imports: [TypeOrmModule.forFeature([MessageStatus, Participant])],
    providers: [MessageStatusesService],
    controllers: [],
    exports: [MessageStatusesService]
})
export class MessageStatusesModule {}
