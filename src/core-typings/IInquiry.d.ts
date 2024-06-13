import type { ILivechatPriority } from './ILivechatPriority';
import type { ILivechatVisitor } from './ILivechatVisitor';
import type { IMessage } from './IMessage';
import type { IOmnichannelServiceLevelAgreements } from './IOmnichannelServiceLevelAgreements';
import type { IRocketChatRecord } from './IRocketChatRecord';
import type { IOmnichannelRoom, OmnichannelSourceType } from './IRoom';
import type { SelectedAgent } from './omnichannel/routing';
export interface IInquiry {
    _id: string;
    _updatedAt?: Date;
    department?: string;
}
export declare enum LivechatInquiryStatus {
    QUEUED = "queued",
    TAKEN = "taken",
    READY = "ready",
    OPEN = "open"
}
export interface IVisitor {
    _id: string;
    username: string;
    token: string;
    status: 'online' | 'busy' | 'away' | 'offline';
    phone?: string | null;
    lastMessageTs?: Date;
}
export interface ILivechatInquiryRecord extends IRocketChatRecord {
    rid: string;
    name: string;
    ts: Date;
    message: string;
    status: LivechatInquiryStatus;
    v: Pick<ILivechatVisitor, '_id' | 'username' | 'status' | 'name' | 'token' | 'phone' | 'activity'> & {
        lastMessageTs?: Date;
    };
    t: 'l';
    department?: string;
    estimatedInactivityCloseTimeAt?: Date;
    locked?: boolean;
    lockedAt?: Date;
    lastMessage?: IMessage & {
        token?: string;
    };
    defaultAgent?: SelectedAgent;
    source?: {
        type: OmnichannelSourceType;
    };
    priorityId?: IOmnichannelRoom['priorityId'];
    priorityWeight: ILivechatPriority['sortItem'];
    slaId?: string;
    estimatedWaitingTimeQueue: IOmnichannelServiceLevelAgreements['dueTimeInMinutes'];
}
export type InquiryWithAgentInfo = Pick<ILivechatInquiryRecord, '_id' | 'rid' | 'name' | 'ts' | 'status' | 'department' | 'v'> & {
    position?: number;
    defaultAgent?: SelectedAgent;
};
