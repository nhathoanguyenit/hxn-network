import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attachment, Message } from "../chat-app.entities";

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: Repository<Attachment>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async addAttachment(messageId: string, fileUrl: string, fileType?: string, fileSize?: number) {
    const exists = await this.messageRepo.exists({ where: { id: messageId } });
    if (!exists) throw new BadRequestException("Message not found");

    const attachment = this.repo.create({
      message: { id: messageId },
      fileUrl: fileUrl,
      fileType: fileType,
      fileSize: fileSize,
    });
    return this.repo.save(attachment);
  }

  async getMessageAttachments(messageId: string) {
    return this.repo.find({ where: { message: { id: messageId } } });
  }
}
