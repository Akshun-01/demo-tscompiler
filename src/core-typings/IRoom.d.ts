import type { ILivechatPriority } from './ILivechatPriority';
import type { ILivechatVisitor } from './ILivechatVisitor';
import type { IMessage, MessageTypesValues } from './IMessage';
import type { IOmnichannelServiceLevelAgreements } from './IOmnichannelServiceLevelAgreements';
import type { IRocketChatRecord } from './IRocketChatRecord';
import type { IUser, Username } from './IUser';
import type { RoomType } from './RoomType';
type CallStatus = 'ringing' | 'ended' | 'declined' | 'ongoing';
export type RoomID = string;
export type ChannelName = string;
interface IRequestTranscript {
    email: string;
    subject: string;
    requestedAt: Date;
    requestedBy: Pick<IUser, '_id' | 'username' | 'name' | 'utcOffset'>;
} 
export interface IRoom extends IRocketChatRecord {
    _id: RoomID;
    t: RoomType;
    name?: string;
    fname?: string;
    msgs: number;
    default?: boolean;
    broadcast?: true;
    featured?: true;
    announcement?: string;
    joinCodeRequired?: boolean;
    announcementDetails?: {
        style?: string;
    };
    encrypted?: boolean;
    topic?: string;
    reactWhenReadOnly?: boolean;
    sysMes?: MessageTypesValues[] | boolean;
    u: Pick<IUser, '_id' | 'username' | 'name'>;
    uids?: Array<string>;
    lastMessage?: IMessage;
    lm?: Date;
    usersCount: number;
    callStatus?: CallStatus;
    webRtcCallStartTime?: Date;
    servedBy?: {
        _id: string;
    };
    streamingOptions?: {
        id?: string;
        type?: string;
        url?: string;
        thumbnail?: string;
        isAudioOnly?: boolean;
        message?: string;
    };
    prid?: string;
    avatarETag?: string;
    teamMain?: boolean;
    teamId?: string;
    teamDefault?: boolean;
    open?: boolean;
    autoTranslateLanguage?: string;
    autoTranslate?: boolean;
    unread?: number;
    alert?: boolean;
    hideUnreadStatus?: boolean;
    hideMentionStatus?: boolean;
    muted?: string[];
    unmuted?: string[];
    usernames?: string[];
    ts?: Date;
    cl?: boolean;
    ro?: boolean;
    favorite?: boolean;
    archived?: boolean;
    description?: string;
    createdOTR?: boolean;
    e2eKeyId?: string;
    federated?: boolean;
    customFields?: Record<string, any>;
    channel?: {
        _id: string;
    };
}
export declare const isRoomWithJoinCode: (room: Partial<IRoom>) => room is IRoomWithJoinCode;
export interface IRoomWithJoinCode extends IRoom {
    joinCodeRequired: true;
    joinCode: string;
}
export interface IRoomFederated extends IRoom {
    federated: true;
}
export declare const isRoomFederated: (room: Partial<IRoom>) => room is IRoomFederated;
export interface ICreatedRoom extends IRoom {
    rid: string;
    inserted: boolean;
}
export interface ITeamRoom extends IRoom {
    teamMain: boolean;
    teamId: string;
}
export declare const isTeamRoom: (room: Partial<IRoom>) => room is ITeamRoom;
export declare const isPrivateTeamRoom: (room: Partial<IRoom>) => room is ITeamRoom;
export declare const isPublicTeamRoom: (room: Partial<IRoom>) => room is ITeamRoom;
export declare const isDiscussion: (room: Partial<IRoom>) => room is IRoom;
export declare const isPrivateDiscussion: (room: Partial<IRoom>) => room is IRoom;
export declare const isPublicDiscussion: (room: Partial<IRoom>) => room is IRoom;
export declare const isPublicRoom: (room: Partial<IRoom>) => room is IRoom;
export interface IDirectMessageRoom extends Omit<IRoom, 'default' | 'featured' | 'u' | 'name'> {
    t: 'd';
    uids: Array<string>;
    usernames: Array<Username>;
}
export declare const isDirectMessageRoom: (room: Partial<IRoom> | IDirectMessageRoom) => room is IDirectMessageRoom;
export declare const isMultipleDirectMessageRoom: (room: IRoom | IDirectMessageRoom) => room is IDirectMessageRoom;
export declare enum OmnichannelSourceType {
    WIDGET = "widget",
    EMAIL = "email",
    SMS = "sms",
    APP = "app",
    API = "api",
    OTHER = "other"
}
export interface IOmnichannelGenericRoom extends Omit<IRoom, 'default' | 'featured' | 'broadcast' | ''> {
    t: 'l' | 'v';
    v: Pick<ILivechatVisitor, '_id' | 'username' | 'status' | 'name' | 'token' | 'activity'> & {
        lastMessageTs?: Date;
        phone?: string;
    };
    email?: {
        inbox: string;
        thread: string[];
        replyTo: string;
        subject: string;
    };
    source: {
        type: OmnichannelSourceType;
        id?: string;
        alias?: string;
        label?: string;
        sidebarIcon?: string;
        defaultIcon?: string;
    };
    transcriptRequest?: IRequestTranscript;
    servedBy?: {
        _id: string;
        ts: Date;
        username: IUser['username'];
    };
    onHold?: boolean;
    departmentId?: string;
    lastMessage?: IMessage & {
        token?: string;
    };
    tags?: string[];
    closedAt?: Date;
    metrics?: {
        serviceTimeDuration?: number;
    };
    waitingResponse: any;
    responseBy?: {
        _id: string;
        username: string;
        firstResponseTs: Date;
        lastMessageTs: Date;
    };
    livechatData: any;
    queuedAt?: Date;
    status?: 'queued' | 'taken' | 'ready';
    ts: Date;
    label?: string;
    crmData?: unknown;
    closer?: 'user' | 'visitor';
    closedBy?: {
        _id: string;
        username: IUser['username'];
    };
    closingMessage?: IMessage;
    departmentAncestors?: string[];
}
export interface IOmnichannelRoom extends IOmnichannelGenericRoom {
    t: 'l';
    omnichannel?: {
        predictedVisitorAbandonmentAt: Date;
    };
    sms?: {
        from: string;
    };
    priorityId?: string;
    priorityWeight: ILivechatPriority['sortItem'];
    slaId?: string;
    estimatedWaitingTimeQueue: IOmnichannelServiceLevelAgreements['dueTimeInMinutes'];
    pdfTranscriptRequested?: boolean;
    pdfTranscriptFileId?: string;
    metrics?: {
        serviceTimeDuration?: number;
        chatDuration?: number;
        v?: {
            lq: Date;
        };
        servedBy?: {
            lr: Date;
        };
        response?: {
            tt: number;
            total: number;
            avg: number;
            ft: number;
        };
        reaction?: {
            ft: number;
        };
    };
    autoTransferredAt?: Date;
    autoTransferOngoing?: boolean;
}
export interface IVoipRoom extends IOmnichannelGenericRoom {
    t: 'v';
    name: string;
    callStarted: Date;
    callDuration?: number;
    callWaitingTime?: number;
    callTotalHoldTime?: number;
    queue: string;
    callUniqueId?: string;
    v: Pick<ILivechatVisitor, '_id' | 'username' | 'status' | 'name' | 'token'> & {
        lastMessageTs?: Date;
        phone?: string;
    };
    direction: 'inbound' | 'outbound';
}
export interface IOmnichannelRoomFromAppSource extends IOmnichannelRoom {
    source: {
        type: OmnichannelSourceType.APP;
        id: string;
        alias?: string;
        sidebarIcon?: string;
        defaultIcon?: string;
    };
}
export type IVoipRoomClosingInfo = Pick<IOmnichannelGenericRoom, 'closer' | 'closedBy' | 'closedAt' | 'tags'> & Pick<IVoipRoom, 'callDuration' | 'callTotalHoldTime'> & {
    serviceTimeDuration?: number;
};
export type IOmnichannelRoomClosingInfo = Pick<IOmnichannelGenericRoom, 'closer' | 'closedBy' | 'closedAt' | 'tags'> & {
    serviceTimeDuration?: number;
    chatDuration: number;
};
export declare const isOmnichannelRoom: (room: Pick<IRoom, 't'>) => room is IOmnichannelRoom & IRoom;
export declare const isVoipRoom: (room: IRoom) => room is IVoipRoom & IRoom;
export declare const isOmnichannelRoomFromAppSource: (room: IRoom) => room is IOmnichannelRoomFromAppSource;
export type RoomAdminFieldsType = '_id' | 'prid' | 'fname' | 'name' | 't' | 'cl' | 'u' | 'usernames' | 'usersCount' | 'muted' | 'unmuted' | 'ro' | 'default' | 'favorite' | 'featured' | 'reactWhenReadOnly' | 'topic' | 'msgs' | 'archived' | 'teamId' | 'teamMain' | 'announcement' | 'description' | 'broadcast' | 'uids' | 'avatarETag';
export interface IRoomWithRetentionPolicy extends IRoom {
    retention: {
        enabled?: boolean;
        maxAge: number;
        filesOnly: boolean;
        excludePinned: boolean;
        ignoreThreads: boolean;
        overrideGlobal?: boolean;
    };
}
export {};
