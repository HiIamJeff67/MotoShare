"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = exports.toBoolean = void 0;
const toBoolean = function (booleanString) {
    return booleanString === "true";
};
exports.toBoolean = toBoolean;
const toNumber = function (numberString, isPositive = true) {
    return isPositive ? +numberString : -numberString;
};
exports.toNumber = toNumber;
//# sourceMappingURL=stringParser.js.map