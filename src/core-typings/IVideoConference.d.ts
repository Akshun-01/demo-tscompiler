import type { IMessage } from './IMessage';
import type { IRocketChatRecord } from './IRocketChatRecord';
import type { IRoom } from './IRoom';
import type { IUser } from './IUser';
import type { AtLeast } from './utils';
export declare enum VideoConferenceStatus {
    CALLING = 0,
    STARTED = 1,
    EXPIRED = 2,
    ENDED = 3,
    DECLINED = 4
}
export type DirectCallInstructions = {
    type: 'direct';
    calleeId: IUser['_id'];
    callId: string;
};
export type ConferenceInstructions = {
    type: 'videoconference';
    callId: string;
    rid: IRoom['_id'];
};
export type LivechatInstructions = {
    type: 'livechat';
    callId: string;
};
export type VideoConferenceType = DirectCallInstructions['type'] | ConferenceInstructions['type'] | LivechatInstructions['type'];
export interface IVideoConferenceUser extends Pick<Required<IUser>, '_id' | 'username' | 'name' | 'avatarETag'> {
    ts: Date;
}
export interface IVideoConference extends IRocketChatRecord {
    type: VideoConferenceType;
    rid: string;
    users: IVideoConferenceUser[];
    status: VideoConferenceStatus;
    messages: {
        started?: IMessage['_id'];
        ended?: IMessage['_id'];
    };
    url?: string;
    createdBy: Pick<Required<IUser>, '_id' | 'username' | 'name'>;
    createdAt: Date;
    endedBy?: Pick<Required<IUser>, '_id' | 'username' | 'name'>;
    endedAt?: Date;
    providerName: string;
    providerData?: Record<string, any>;
    ringing?: boolean;
}
export interface IDirectVideoConference extends IVideoConference {
    type: 'direct';
}
export interface IGroupVideoConference extends IVideoConference {
    type: 'videoconference';
    anonymousUsers: number;
    title: string;
}
export interface ILivechatVideoConference extends IVideoConference {
    type: 'livechat';
}
export type VideoConference = IDirectVideoConference | IGroupVideoConference | ILivechatVideoConference;
export type VideoConferenceInstructions = DirectCallInstructions | ConferenceInstructions | LivechatInstructions;
export declare const isDirectVideoConference: (call: VideoConference | undefined | null) => call is IDirectVideoConference;
export declare const isGroupVideoConference: (call: VideoConference | undefined | null) => call is IGroupVideoConference;
export declare const isLivechatVideoConference: (call: VideoConference | undefined | null) => call is ILivechatVideoConference;
type GroupVideoConferenceCreateData = Omit<IGroupVideoConference, 'createdBy'> & {
    createdBy: IUser['_id'];
};
type DirectVideoConferenceCreateData = Omit<IDirectVideoConference, 'createdBy'> & {
    createdBy: IUser['_id'];
};
type LivechatVideoConferenceCreateData = Omit<ILivechatVideoConference, 'createdBy'> & {
    createdBy: IUser['_id'];
};
export type VideoConferenceCreateData = AtLeast<DirectVideoConferenceCreateData | GroupVideoConferenceCreateData | LivechatVideoConferenceCreateData, 'createdBy' | 'type' | 'rid' | 'providerName' | 'providerData'>;
export {};
