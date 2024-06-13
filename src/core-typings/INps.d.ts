import type { IRocketChatRecord } from './IRocketChatRecord';
import type { IUser } from './IUser';
export declare enum NPSStatus {
    OPEN = "open",
    SENDING = "sending",
    SENT = "sent",
    CLOSED = "closed"
}
export interface INps extends IRocketChatRecord {
    startAt: Date;
    expireAt: Date;
    createdBy: Pick<IUser, '_id' | 'username'>;
    createdAt: Date;
    status: NPSStatus;
}
export declare enum INpsVoteStatus {
    NEW = "new",
    SENDING = "sending",
    SENT = "sent"
}
export interface INpsVote extends IRocketChatRecord {
    _id: string;
    npsId: INps['_id'];
    ts: Date;
    identifier: string;
    roles?: IUser['roles'];
    score: number;
    comment: string;
    status: INpsVoteStatus;
    sentAt?: Date;
}
