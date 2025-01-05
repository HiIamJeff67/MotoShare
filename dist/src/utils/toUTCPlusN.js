"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUTCPlusN = void 0;
const toUTCPlusN = function (date, n = 8) {
    return new Date(date.setUTCHours(date.getUTCHours() + n));
};
exports.toUTCPlusN = toUTCPlusN;
//# sourceMappingURL=toUTCPlusN.js.map