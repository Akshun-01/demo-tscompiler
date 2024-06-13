import type { MessageAttachment } from './MessageAttachment';
import type { MessageAttachmentDefault } from './MessageAttachmentDefault';
export interface ITranslatedMessageAttachment extends MessageAttachmentDefault {
    translations: {
        [language: string]: string;
    };
}
export declare const isTranslatedAttachment: (attachment: MessageAttachment) => attachment is ITranslatedMessageAttachment;
export declare const isTranslatedMessageAttachment: (attachments: MessageAttachment[]) => attachments is ITranslatedMessageAttachment[];
