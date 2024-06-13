import type { MessageAttachmentBase } from '../MessageAttachmentBase';
import type { Dimensions } from './Dimensions';
import type { FileAttachmentProps } from './FileAttachmentProps';
import type { FileProp } from './FileProp';
export type ImageAttachmentProps = {
    image_dimensions?: Dimensions;
    image_preview?: string;
    image_url: string;
    image_type?: string;
    image_size?: number;
    file?: FileProp;
} & MessageAttachmentBase;
export declare const isFileImageAttachment: (attachment: FileAttachmentProps) => attachment is {
    image_dimensions?: Dimensions | undefined;
    image_preview?: string | undefined;
    image_url: string;
    image_type?: string | undefined;
    image_size?: number | undefined;
    file?: FileProp | undefined;
} & MessageAttachmentBase & {
    type: 'file';
};
