export type VoipPropagatedEvents = 'agentcalled' | 'agentconnected' | 'callerjoined' | 'queuememberadded' | 'queuememberremoved' | 'callabandoned';
export type VoipEventDataSignature = {
    event: 'agent-called';
    data: {
        callerId: {
            id: string;
            name: string;
        };
        queue: string;
    };
} | {
    event: 'agent-connected';
    data: {
        queue: string;
        queuedCalls: string;
        waitTimeInQueue: string;
    };
} | {
    event: 'caller-joined';
    data: {
        callerId: {
            id: string;
            name: string;
        };
        queue: string;
        queuedCalls: string;
    };
} | {
    event: 'queue-member-added';
    data: {
        queue: string;
        queuedCalls: string;
    };
} | {
    event: 'queue-member-removed';
    data: {
        queue: string;
        queuedCalls: string;
    };
} | {
    event: 'call-abandoned';
    data: {
        queuedCallAfterAbandon: string;
        queue: string;
    };
};
export declare const isVoipEventAgentCalled: (data: VoipEventDataSignature) => data is {
    event: 'agent-called';
    data: {
        callerId: {
            id: string;
            name: string;
        };
        queue: string;
    };
};
export declare const isVoipEventAgentConnected: (data: VoipEventDataSignature) => data is {
    event: 'agent-connected';
    data: {
        queue: string;
        queuedCalls: string;
        waitTimeInQueue: string;
    };
};
export declare const isVoipEventCallerJoined: (data: VoipEventDataSignature) => data is {
    event: 'caller-joined';
    data: {
        callerId: {
            id: string;
            name: string;
        };
        queue: string;
        queuedCalls: string;
    };
};
export declare const isVoipEventQueueMemberAdded: (data: VoipEventDataSignature) => data is {
    event: 'queue-member-added';
    data: {
        queue: string;
        queuedCalls: string;
    };
};
export declare const isVoipEventQueueMemberRemoved: (data: VoipEventDataSignature) => data is {
    event: 'queue-member-removed';
    data: {
        queue: string;
        queuedCalls: string;
    };
};
export declare const isVoipEventCallAbandoned: (data: VoipEventDataSignature) => data is {
    event: 'call-abandoned';
    data: {
        queuedCallAfterAbandon: string;
        queue: string;
    };
};
