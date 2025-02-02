"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIDialingEvent = exports.isICallHangupEvent = exports.isIContactStatusEvent = exports.isICallUnHoldEvent = exports.isICallOnHoldEvent = exports.isIQueueCallerAbandonEvent = exports.isIQueueMemberRemovedEvent = exports.isIQueueMemberAddedEvent = exports.isIQueueCallerJoinEvent = exports.isIAgentCalledEvent = exports.isIAgentConnectEvent = void 0;
const isIAgentConnectEvent = (v) => v?.event === 'AgentConnect';
exports.isIAgentConnectEvent = isIAgentConnectEvent;
const isIAgentCalledEvent = (v) => v?.event === 'AgentCalled';
exports.isIAgentCalledEvent = isIAgentCalledEvent;
const isIQueueCallerJoinEvent = (v) => v?.event === 'QueueCallerJoin';
exports.isIQueueCallerJoinEvent = isIQueueCallerJoinEvent;
const isIQueueMemberAddedEvent = (v) => v?.event === 'QueueMemberAdded';
exports.isIQueueMemberAddedEvent = isIQueueMemberAddedEvent;
const isIQueueMemberRemovedEvent = (v) => v?.event === 'QueueMemberRemoved';
exports.isIQueueMemberRemovedEvent = isIQueueMemberRemovedEvent;
const isIQueueCallerAbandonEvent = (v) => v?.event === 'QueueCallerAbandon';
exports.isIQueueCallerAbandonEvent = isIQueueCallerAbandonEvent;
const isICallOnHoldEvent = (v) => v?.event === 'Hold';
exports.isICallOnHoldEvent = isICallOnHoldEvent;
const isICallUnHoldEvent = (v) => v?.event === 'Unhold';
exports.isICallUnHoldEvent = isICallUnHoldEvent;
const isIContactStatusEvent = (v) => v?.event === 'ContactStatus';
exports.isIContactStatusEvent = isIContactStatusEvent;
const isICallHangupEvent = (v) => v?.event === 'Hangup';
exports.isICallHangupEvent = isICallHangupEvent;
const isIDialingEvent = (v) => v?.event === 'DialState' || v?.event === 'DialEnd';
exports.isIDialingEvent = isIDialingEvent;
//# sourceMappingURL=IEvents.js.map