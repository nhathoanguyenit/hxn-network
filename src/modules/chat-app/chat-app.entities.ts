import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from "typeorm";

@Entity({ name: "chats" })
export class Chat {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    type: string;

    @Column({ nullable: true })
    title: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => Participant, (participant) => participant.chat)
    participants: Participant[];

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];
}

@Entity({ name: 'chat_messages' })
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { name: "chat_id" })
    chatId: string;

    @Column('uuid', { name: "sender_id" }) 
    senderId: string;

    @Column('uuid', { name: "sender_name" }) 
    senderName: string;

    @Column({ nullable: true })
    content: string;

    @Column('uuid', { nullable: true, name: "reply_to" })
    replyTo: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Chat, (chat) => chat.messages)
    @JoinColumn({ name: "chat_id" })
    chat: Chat;

    @OneToMany(() => MessageStatus, (status) => status.message)
    statuses: MessageStatus[];

    @OneToMany(() => Attachment, (attachment) => attachment.message)
    attachments: Attachment[];
}

@Entity({ name: "chat_message_statuses" })
export class MessageStatus {
    @PrimaryColumn("uuid", { name: "message_id" })
    messageId: string;

    @PrimaryColumn("uuid", { name: "user_id" })
    userId: string;

    @Column({ nullable: true, name: "delivered_at" })
    deliveredAt: Date;

    @Column({ nullable: true, name: "read_at" })
    readAt: Date;

    @ManyToOne(() => Message, (message) => message.statuses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "message_id" })
    message: Message;
}

@Entity({ name: "chat_participants" })
export class Participant {
    @PrimaryColumn("uuid", { name: "chat_id" })
    chatId: string;

    @PrimaryColumn("uuid", { name: "user_id" })
    userId: string;

    @Column({ default: false, name: "is_admin" })
    isAdmin: boolean;

    @CreateDateColumn({ name: "joined_at" })
    joinedAt: Date;

    @ManyToOne(() => Chat, (chat) => chat.participants, { onDelete: "CASCADE" })
    @JoinColumn({ name: "chat_id" })
    chat: Chat;
}

@Entity({ name: "chat_attachments" })
export class Attachment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "file_url" })
    fileUrl: string;

    @Column({ nullable: true, name: "file_type" })
    fileType: string;

    @Column({ nullable: true, name: "file_size" })
    fileSize: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => Message, (message) => message.attachments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "message_id" })
    message: Message;
}
