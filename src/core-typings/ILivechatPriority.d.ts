import type { IRocketChatRecord } from './IRocketChatRecord';
export declare enum LivechatPriorityWeight {
    LOWEST = 5,
    LOW = 4,
    MEDIUM = 3,
    HIGH = 2,
    HIGHEST = 1,
    NOT_SPECIFIED = 99
}
export interface ILivechatPriority extends IRocketChatRecord {
    name?: string;
    i18n: string;
    sortItem: LivechatPriorityWeight;
    dirty: boolean;
}
export type ILivechatPriorityData = Omit<ILivechatPriority, '_id' | '_updatedAt'>;
