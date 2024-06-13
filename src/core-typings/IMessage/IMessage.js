"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoConfMessage = exports.isOTRAckMessage = exports.isOTRMessage = exports.isE2EEMessage = exports.isVoipMessage = exports.isIMessageInbox = exports.isMessageDiscussion = exports.isPrivateMessage = exports.isDiscussionMessage = exports.isThreadMessage = exports.isThreadMainMessage = exports.isTranslatedMessage = exports.isMessageFromMatrixFederation = exports.isDeletedMessage = exports.isEditedMessage = void 0;
const isEditedMessage = (message) => 'editedAt' in message &&
    message.editedAt instanceof Date &&
    'editedBy' in message &&
    typeof message.editedBy === 'object' &&
    message.editedBy !== null &&
    '_id' in message.editedBy &&
    typeof message.editedBy._id === 'string';
exports.isEditedMessage = isEditedMessage;
const isDeletedMessage = (message) => (0, exports.isEditedMessage)(message) && message.t === 'rm';
exports.isDeletedMessage = isDeletedMessage;
const isMessageFromMatrixFederation = (message) => 'federation' in message && Boolean(message.federation?.eventId);
exports.isMessageFromMatrixFederation = isMessageFromMatrixFederation;
const isTranslatedMessage = (message) => 'translations' in message;
exports.isTranslatedMessage = isTranslatedMessage;
const isThreadMainMessage = (message) => 'tcount' in message && 'tlm' in message;
exports.isThreadMainMessage = isThreadMainMessage;
const isThreadMessage = (message) => !!message.tmid;
exports.isThreadMessage = isThreadMessage;
const isDiscussionMessage = (message) => !!message.drid;
exports.isDiscussionMessage = isDiscussionMessage;
const isPrivateMessage = (message) => !!message.private;
exports.isPrivateMessage = isPrivateMessage;
const isMessageDiscussion = (message) => {
    return 'drid' in message;
};
exports.isMessageDiscussion = isMessageDiscussion;
const isIMessageInbox = (message) => 'email' in message;
exports.isIMessageInbox = isIMessageInbox;
const isVoipMessage = (message) => 'voipData' in message;
exports.isVoipMessage = isVoipMessage;
const isE2EEMessage = (message) => message.t === 'e2e';
exports.isE2EEMessage = isE2EEMessage;
const isOTRMessage = (message) => message.t === 'otr';
exports.isOTRMessage = isOTRMessage;
const isOTRAckMessage = (message) => message.t === 'otr-ack';
exports.isOTRAckMessage = isOTRAckMessage;
const isVideoConfMessage = (message) => message.t === 'videoconf';
exports.isVideoConfMessage = isVideoConfMessage;
//# sourceMappingURL=IMessage.js.map