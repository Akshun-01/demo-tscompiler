export interface IEventBase {
    event: string;
    privilege: string;
    systemname: string;
    channel: string;
    channelstate: string;
    channelstatedesc: 'Up' | 'Down';
    calleridnum: string;
    calleridname: string;
    connectedlinenum: string;
    connectedlinename: string;
    language: string;
    accountcode: string;
    context: string;
    exten: string;
    priority: string;
    uniqueid: string;
    linkedid: string;
    destchannel: string;
    destchannelstate: string;
    destcalleridnum: string;
    destcalleridname: string;
    destconnectedlinenum: string;
    destconnectedlinename: string;
    destlanguage: string;
    destaccountcode: string;
    destcontext: string;
    destexten: string;
    destpriority: string;
    destuniqueid: string;
    destlinkedid: string;
}
/**  Not all events will contain following
 * fields. In the minimal, every event will contain
 * event name.
 *
 * As we move further in handling different events, we will
 * refactor this class. For the time being, we will take a simple
 * of everything deriving from IEventBase.
 *
 * IQueueEvent represents all the queue events which have the parameters
 * listed below.
 */
export interface IQueueEvent extends IEventBase {
    membername: string;
    queue: string;
    interface: string;
}
export type DialStatus = 'ringing' | 'answer';
export interface IDialingEvent extends IEventBase {
    dialstatus: DialStatus;
}
export interface IDialBegin extends IEventBase {
    dialstring: string;
}
export type ContactStatuses = 'NonQualified' | 'Reachable' | 'Removed';
export interface IContactStatus extends IEventBase {
    event: 'ContactStatus';
    privilege: string;
    systemname: string;
    uri: string;
    contactstatus: ContactStatuses;
    aor: string;
    endpointname: string;
    roundtripusec: string;
}
export interface IAgentConnectEvent extends IQueueEvent {
    event: 'AgentConnect';
    holdtime: string;
}
export interface IAgentCalledEvent extends IQueueEvent {
    event: 'AgentCalled';
    queuename: string;
}
export interface IQueueCallerJoinEvent extends IQueueEvent {
    event: 'QueueCallerJoin';
    count: string;
}
export interface IQueueMemberAdded extends IQueueEvent {
    event: 'QueueMemberAdded';
    queue: string;
    interface: string;
}
export interface IQueueMemberRemoved extends IQueueEvent {
    event: 'QueueMemberRemoved';
    queue: string;
    interface: string;
}
export interface IQueueCallerAbandon extends IQueueEvent {
    event: 'QueueCallerAbandon';
    queue: string;
}
export interface ICallOnHold extends IQueueEvent {
    event: 'Hold';
}
export interface ICallUnHold extends IQueueEvent {
    event: 'Unhold';
}
export interface ICallHangup extends IQueueEvent {
    'event': 'Hangup';
    'cause-txt': string;
}
export declare const isIAgentConnectEvent: (v: any) => v is IAgentConnectEvent;
export declare const isIAgentCalledEvent: (v: any) => v is IAgentCalledEvent;
export declare const isIQueueCallerJoinEvent: (v: any) => v is IQueueCallerJoinEvent;
export declare const isIQueueMemberAddedEvent: (v: any) => v is IQueueMemberAdded;
export declare const isIQueueMemberRemovedEvent: (v: any) => v is IQueueMemberRemoved;
export declare const isIQueueCallerAbandonEvent: (v: any) => v is IQueueCallerAbandon;
export declare const isICallOnHoldEvent: (v: any) => v is ICallOnHold;
export declare const isICallUnHoldEvent: (v: any) => v is ICallUnHold;
export declare const isIContactStatusEvent: (v: any) => v is IContactStatus;
export declare const isICallHangupEvent: (v: any) => v is ICallHangup;
export declare const isIDialingEvent: (v: any) => v is IDialingEvent;
