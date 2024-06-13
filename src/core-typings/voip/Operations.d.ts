/**
 * Enumerator representing current operation.
 * @remarks
 * This enumerator value along with callstate will be responsible for
 * valid actions while making/receiving a call to/from remote party.
 */
export declare enum Operation {
    OP_NONE = 0,
    OP_CONNECT = 1,
    OP_REGISTER = 2,
    OP_UNREGISTER = 3,
    OP_PROCESS_INVITE = 4,
    OP_SEND_INVITE = 5,
    OP_CLEANUP = 6
}
