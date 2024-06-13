import type { MessageAttachmentBase } from '../MessageAttachmentBase';
import type { FileAttachmentProps } from './FileAttachmentProps';
import type { FileProp } from './FileProp';
export type AudioAttachmentProps = {
    audio_url: string;
    audio_type: string;
    audio_size?: number;
    file?: FileProp;
} & MessageAttachmentBase;
export declare const isFileAudioAttachment: (attachment: FileAttachmentProps) => attachment is {
    audio_url: string;
    audio_type: string;
    audio_size?: number | undefined;
    file?: FileProp | undefined;
} & MessageAttachmentBase & {
    type: 'file';
};
