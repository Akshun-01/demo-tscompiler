import type { IRocketChatRecord } from './IRocketChatRecord';
export interface IPbxEvent extends IRocketChatRecord {
    uniqueId: string;
    event: string;
    phone?: string;
    queue?: string;
    ts: Date;
    holdTime?: string;
    callUniqueId?: string;
    callUniqueIdFallback?: string;
    agentExtension?: string;
}
