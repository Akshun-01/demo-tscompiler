import type { Root } from '@rocket.chat/message-parser';
import type { MessageAttachment } from './MessageAttachment';
import type { MessageAttachmentBase } from './MessageAttachmentBase';
export type MessageQuoteAttachment = {
    author_name: string;
    author_link: string;
    author_icon: string;
    message_link?: string;
    text: string;
    md?: Root;
    attachments?: Array<MessageQuoteAttachment>;
} & MessageAttachmentBase;
export declare const isQuoteAttachment: (attachment: MessageAttachment) => attachment is MessageQuoteAttachment;
