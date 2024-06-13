import type { IRocketChatRecord } from './IRocketChatRecord';
export declare const DEFAULT_SLA_CONFIG: {
    ESTIMATED_WAITING_TIME_QUEUE: number;
};
export interface IOmnichannelServiceLevelAgreements extends IRocketChatRecord {
    name: string;
    description?: string;
    dueTimeInMinutes: number;
}
