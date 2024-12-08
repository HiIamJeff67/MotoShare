"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToDaysOfWeek = exports.daysOfWeekToNumber = exports.ISOStringToTimeOnlyString = exports.ISOStringToDateOnly = exports.addDays = exports.addHours = exports.addMinutes = exports.addSeconds = void 0;
const exceptions_1 = require("../exceptions");
const types_1 = require("../types");
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
const ISOStringToDateOnly = function (ISODateString) {
    const datetime = new Date(ISODateString);
    if (isNaN(datetime.getTime()))
        throw exceptions_1.ApiISOStringFormException;
    return datetime.toISOString().split("T")[0];
};
exports.ISOStringToDateOnly = ISOStringToDateOnly;
const ISOStringToTimeOnlyString = function (ISODateString) {
    const datetime = new Date(ISODateString);
    if (isNaN(datetime.getTime()))
        throw exceptions_1.ApiISOStringFormException;
    return datetime.toISOString().split("T")[1].split("Z")[0];
};
exports.ISOStringToTimeOnlyString = ISOStringToTimeOnlyString;
const daysOfWeekToNumber = function (daysOfWeek) {
    switch (daysOfWeek) {
        case "Monday": return 1;
        case "Tuesday": return 2;
        case "Wednesday": return 3;
        case "Thursday": return 4;
        case "Friday": return 5;
        case "Saturday": return 6;
        case "Sunday": return 7;
        default: return 1;
    }
};
exports.daysOfWeekToNumber = daysOfWeekToNumber;
const numberToDaysOfWeek = function (daysOfWeekNumber) {
    return types_1.DaysOfWeekTypes[daysOfWeekNumber - 1];
};
exports.numberToDaysOfWeek = numberToDaysOfWeek;
//# sourceMappingURL=timeCalculator.js.map