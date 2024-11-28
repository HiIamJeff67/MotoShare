"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = exports.addHours = exports.addMinutes = exports.addSeconds = void 0;
const addSeconds = function (second, initTime = new Date()) {
    return new Date(initTime.getTime() + second * 1000);
};
exports.addSeconds = addSeconds;
const addMinutes = function (minutes, initTime = new Date()) {
    return new Date(initTime.getTime() + minutes * 60000);
};
exports.addMinutes = addMinutes;
const addHours = function (hours, initTime = new Date()) {
    return new Date(initTime.getTime() + hours * 3600000);
};
exports.addHours = addHours;
const addDays = function (days, initTime = new Date()) {
    return new Date(initTime.getTime() + days * 86400000);
};
exports.addDays = addDays;
//# sourceMappingURL=timeCalculator.js.map