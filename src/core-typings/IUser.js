"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserFederated = exports.isRegisterUser = void 0;
const isRegisterUser = (user) => user.username !== undefined && user.name !== undefined;
exports.isRegisterUser = isRegisterUser;
const isUserFederated = (user) => 'federated' in user && user.federated === true;
exports.isUserFederated = isUserFederated;
//# sourceMappingURL=IUser.js.map