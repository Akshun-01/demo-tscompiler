import type { MessageAttachmentBase } from '../MessageAttachmentBase';
import type { FileAttachmentProps } from './FileAttachmentProps';
import type { FileProp } from './FileProp';
export type VideoAttachmentProps = {
    video_url: string;
    video_type: string;
    video_size: number;
    file?: FileProp;
} & MessageAttachmentBase;
export declare const isFileVideoAttachment: (attachment: FileAttachmentProps) => attachment is {
    video_url: string;
    video_type: string;
    video_size: number;
    file?: FileProp | undefined;
} & MessageAttachmentBase & {
    type: 'file';
};
