import type { IQueueSummary } from './ACDQueues';
import type { IUser } from './IUser';
import type { IExtensionDetails, IRegistrationInfo } from './voip';
export declare enum EndpointState {
    UNKNOWN = "unknown",
    REGISTERED = "registered",
    UNREGISTERED = "unregistered",
    RINGING = "ringing",
    BUSY = "busy"
}
export interface IVoipExtensionBase {
    extension: string;
    state: EndpointState;
}
export interface IVoipExtensionWithAgentInfo extends IVoipExtensionBase {
    queues?: string[];
    userId?: IUser['_id'];
    username?: IUser['username'];
    name?: IUser['name'];
}
export declare const isIVoipExtensionBase: (obj: any) => obj is IVoipExtensionBase;
export interface IVoipExtensionConfig extends IVoipExtensionBase {
    authType: string;
    password: string;
}
export declare const isIVoipExtensionConfig: (obj: any) => obj is IVoipExtensionConfig;
export interface IQueueMembershipDetails {
    extension: string;
    queueCount: number;
    callWaitingCount: number;
}
export interface IQueueMembershipSubscription {
    queues: IQueueSummary[];
    extension: string;
}
export declare const isIQueueMembershipDetails: (obj: any) => obj is IQueueMembershipDetails;
export declare const isIExtensionDetails: (prop: any) => prop is IExtensionDetails;
export declare const isIRegistrationInfo: (prop: any) => prop is IRegistrationInfo;
