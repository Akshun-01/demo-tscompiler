/// <reference types="node" />
import type { UrlWithStringQuery } from 'url';
import type Icons from '@rocket.chat/icons';
import type { Root } from '@rocket.chat/message-parser';
import type { MessageSurfaceLayout } from '@rocket.chat/ui-kit';
import type { ILivechatPriority } from '../ILivechatPriority';
import type { ILivechatVisitor } from '../ILivechatVisitor';
import type { IOmnichannelServiceLevelAgreements } from '../IOmnichannelServiceLevelAgreements';
import type { IRocketChatRecord } from '../IRocketChatRecord';
import type { IRoom, RoomID } from '../IRoom';
import type { IUser } from '../IUser';
import type { FileProp } from './MessageAttachment/Files/FileProp';
import type { MessageAttachment } from './MessageAttachment/MessageAttachment';
export type MessageUrl = {
    url: string;
    source?: string;
    meta: Record<string, string>;
    headers?: {
        contentLength?: string;
        contentType?: string;
    };
    ignoreParse?: boolean;
    parsedUrl?: Pick<UrlWithStringQuery, 'host' | 'hash' | 'pathname' | 'protocol' | 'port' | 'query' | 'search' | 'hostname'>;
};
type VoipMessageTypesValues = 'voip-call-started' | 'voip-call-declined' | 'voip-call-on-hold' | 'voip-call-unhold' | 'voip-call-ended' | 'voip-call-duration' | 'voip-call-wrapup' | 'voip-call-ended-unexpectedly';
type TeamMessageTypes = 'removed-user-from-team' | 'added-user-to-team' | 'ult' | 'user-converted-to-team' | 'user-converted-to-channel' | 'user-removed-room-from-team' | 'user-deleted-room-from-team' | 'user-added-room-to-team' | 'ujt';
type LivechatMessageTypes = 'livechat_navigation_history' | 'livechat_transfer_history' | 'omnichannel_priority_change_history' | 'omnichannel_sla_change_history' | 'livechat_transcript_history' | 'livechat_video_call' | 'livechat_transfer_history_fallback' | 'livechat-close' | 'livechat_webrtc_video_call' | 'livechat-started';
type OmnichannelTypesValues = 'omnichannel_placed_chat_on_hold' | 'omnichannel_on_hold_chat_resumed';
type OtrMessageTypeValues = 'otr' | 'otr-ack';
export type OtrSystemMessages = 'user_joined_otr' | 'user_requested_otr_key_refresh' | 'user_key_refreshed_successfully';
export type MessageTypesValues = 'e2e' | 'uj' | 'ul' | 'ru' | 'au' | 'mute_unmute' | 'r' | 'ut' | 'wm' | 'rm' | 'subscription-role-added' | 'subscription-role-removed' | 'room-archived' | 'room-unarchived' | 'room_changed_privacy' | 'room_changed_description' | 'room_changed_announcement' | 'room_changed_avatar' | 'room_changed_topic' | 'room_e2e_enabled' | 'room_e2e_disabled' | 'user-muted' | 'user-unmuted' | 'room-removed-read-only' | 'room-set-read-only' | 'room-allowed-reacting' | 'room-disallowed-reacting' | 'command' | 'videoconf' | 'message_pinned' | 'new-moderator' | 'moderator-removed' | 'new-owner' | 'owner-removed' | 'new-leader' | 'leader-removed' | 'discussion-created' | LivechatMessageTypes | TeamMessageTypes | VoipMessageTypesValues | OmnichannelTypesValues | OtrMessageTypeValues | OtrSystemMessages;
export type TokenType = 'code' | 'inlinecode' | 'bold' | 'italic' | 'strike' | 'link';
export type Token = {
    token: string;
    text: string;
    type?: TokenType;
    noHtml?: string;
} & TokenExtra;
export type TokenExtra = {
    highlight?: boolean;
    noHtml?: string;
};
export type MessageMention = {
    type?: 'user' | 'team';
    _id: string;
    name?: string;
    username?: string;
    fname?: string;
};
export interface IMessageCustomFields {
} 
export interface IMessage extends IRocketChatRecord {
    rid: RoomID;
    msg: string;
    tmid?: string;
    tshow?: boolean;
    ts: Date;
    mentions?: MessageMention[];
    groupable?: boolean;
    channels?: Pick<IRoom, '_id' | 'name'>[];
    u: Required<Pick<IUser, '_id' | 'username'>> & Pick<IUser, 'name'>;
    blocks?: MessageSurfaceLayout;
    alias?: string;
    md?: Root;
    _hidden?: boolean;
    imported?: boolean;
    replies?: IUser['_id'][];
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    starred?: {
        _id: IUser['_id'];
    }[];
    pinned?: boolean;
    pinnedAt?: Date;
    pinnedBy?: Pick<IUser, '_id' | 'username'>;
    unread?: boolean;
    temp?: boolean;
    drid?: RoomID;
    tlm?: Date;
    dcount?: number;
    tcount?: number;
    t?: MessageTypesValues;
    e2e?: 'pending' | 'done';
    otrAck?: string;
    urls?: MessageUrl[];
    /** @deprecated Deprecated */
    actionLinks?: {
        icon: keyof typeof Icons;
        i18nLabel: unknown;
        label: string;
        method_id: string;
        params: string;
    }[];
    /** @deprecated Deprecated in favor of files */
    file?: FileProp;
    fileUpload?: {
        publicFilePath: string;
        type?: string;
        size?: number;
    };
    files?: FileProp[];
    attachments?: MessageAttachment[];
    reactions?: {
        [key: string]: {
            names?: (string | undefined)[];
            usernames: string[];
            federationReactionEventIds?: Record<string, string>;
        };
    };
    private?: boolean;
    bot?: boolean;
    sentByEmail?: boolean;
    webRtcCallEndTs?: Date;
    role?: string;
    avatar?: string;
    emoji?: string;
    tokens?: Token[];
    html?: string;
    token?: string;
    federation?: {
        eventId: string;
    };
    slaData?: {
        definedBy: Pick<IUser, '_id' | 'username'>;
        sla?: Pick<IOmnichannelServiceLevelAgreements, 'name'>;
    };
    priorityData?: {
        definedBy: Pick<IUser, '_id' | 'username'>;
        priority?: Pick<ILivechatPriority, 'name' | 'i18n'>;
    };
    customFields?: IMessageCustomFields;
}
export type MessageSystem = {
    t: 'system';
};
export interface IEditedMessage extends IMessage {
    editedAt: Date;
    editedBy: Pick<IUser, '_id' | 'username'>;
}
export declare const isEditedMessage: (message: IMessage) => message is IEditedMessage;
export declare const isDeletedMessage: (message: IMessage) => message is IEditedMessage;
export declare const isMessageFromMatrixFederation: (message: IMessage) => boolean;
export interface ITranslatedMessage extends IMessage {
    translations: {
        [key: string]: string;
    } & {
        original?: string;
    };
    translationProvider: string;
    autoTranslateShowInverse?: boolean;
    autoTranslateFetching?: boolean;
}
export declare const isTranslatedMessage: (message: IMessage) => message is ITranslatedMessage;
export interface IThreadMainMessage extends IMessage {
    tcount: number;
    tlm: Date;
    replies: IUser['_id'][];
}
export interface IThreadMessage extends IMessage {
    tmid: string;
}
export declare const isThreadMainMessage: (message: IMessage) => message is IThreadMainMessage;
export declare const isThreadMessage: (message: IMessage) => message is IThreadMessage;
export interface IDiscussionMessage extends IMessage {
    drid: string;
    dlm?: Date;
    dcount: number;
}
export declare const isDiscussionMessage: (message: IMessage) => message is IDiscussionMessage;
export interface IPrivateMessage extends IMessage {
    private: true;
}
export declare const isPrivateMessage: (message: IMessage) => message is IPrivateMessage;
export interface IMessageReactionsNormalized extends IMessage {
    reactions: {
        [key: string]: {
            usernames: Required<IUser['_id']>[];
            names: Required<IUser>['name'][];
        };
    };
}
export interface IOmnichannelSystemMessage extends IMessage {
    navigation?: {
        page: {
            title: string;
            location: {
                href: string;
            };
            token?: string;
        };
    };
    transferData?: {
        comment: string;
        transferredBy: {
            name?: string;
            username: string;
        };
        transferredTo: {
            name?: string;
            username: string;
        };
        nextDepartment?: {
            _id: string;
            name?: string;
        };
        scope: 'department' | 'agent' | 'queue';
    };
    requestData?: {
        type: 'visitor' | 'user';
        visitor?: ILivechatVisitor;
        user?: Pick<IUser, '_id' | 'name' | 'username' | 'utcOffset'> | null;
    };
    webRtcCallEndTs?: Date;
    comment?: string;
}
export type IVoipMessage = IMessage & {
    voipData: {
        callDuration?: number;
        callStarted?: string;
        callWaitingTime?: string;
    };
};
export interface IMessageDiscussion extends IMessage {
    drid: RoomID;
}
export declare const isMessageDiscussion: (message: IMessage) => message is IMessageDiscussion;
export type IMessageInbox = IMessage & {
    email?: {
        references?: string[];
        messageId?: string;
        thread?: string[];
    };
};
export declare const isIMessageInbox: (message: IMessage) => message is IMessageInbox;
export declare const isVoipMessage: (message: IMessage) => message is IVoipMessage;
export type IE2EEMessage = IMessage & {
    t: 'e2e';
    e2e: 'pending' | 'done';
};
export interface IOTRMessage extends IMessage {
    t: 'otr';
    otrAck?: string;
}
export interface IOTRAckMessage extends IMessage {
    t: 'otr-ack';
}
export type IVideoConfMessage = IMessage & {
    t: 'videoconf';
};
export declare const isE2EEMessage: (message: IMessage) => message is IE2EEMessage;
export declare const isOTRMessage: (message: IMessage) => message is IOTRMessage;
export declare const isOTRAckMessage: (message: IMessage) => message is IOTRAckMessage;
export declare const isVideoConfMessage: (message: IMessage) => message is IVideoConfMessage;
export type IMessageWithPendingFileImport = IMessage & {
    _importFile: {
        downloadUrl: string;
        id: string;
        size: number;
        name: string;
        external: boolean;
        source: 'slack' | 'hipchat-enterprise';
        original: Record<string, any>;
        rocketChatUrl?: string;
        downloaded?: boolean;
    };
};
export {};
