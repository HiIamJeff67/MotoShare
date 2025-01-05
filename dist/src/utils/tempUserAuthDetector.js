"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTempEmail = void 0;
const auth_constant_1 = require("../constants/auth.constant");
const isTempEmail = function (email) {
    const head = email.split('_')[0];
    const splitedEmail = email.split('@');
    const tail = splitedEmail[splitedEmail.length - 1];
    return head === auth_constant_1.TEMP_EMAIL_HEAD && tail === auth_constant_1.TEMP_EMAIL_TAIL;
};
exports.isTempEmail = isTempEmail;
//# sourceMappingURL=tempUserAuthDetector.js.map