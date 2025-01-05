"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterFirstSearchFieldsValidation = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let BetterFirstSearchFieldsValidation = class BetterFirstSearchFieldsValidation {
    validate(value, args) {
        const { startAfter, endedAt, startCordLongitude, startCordLatitude, endCordLongitude, endCordLatitude } = value;
        const isStartAfterOrEndedAtProvided = !!startAfter || !!endedAt;
        const isStartCordsProvided = !!startCordLongitude && !!startCordLatitude;
        const isEndCordsProvided = !!endCordLongitude && !!endCordLatitude;
        if (!isStartAfterOrEndedAtProvided && !isStartCordsProvided && !isEndCordsProvided) {
            return false;
        }
        if (startAfter && endedAt && new Date(startAfter) >= new Date(endedAt)) {
            return false;
        }
        if ((startCordLongitude && !startCordLatitude) ||
            (!startCordLongitude && startCordLatitude) ||
            (endCordLongitude && !endCordLatitude) ||
            (!endCordLongitude && endCordLatitude)) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return `Invalid input: either provide valid 'startAfter'/'endedAt' values or complete 'startCord'/'endCord' pairs.`;
    }
};
exports.BetterFirstSearchFieldsValidation = BetterFirstSearchFieldsValidation;
exports.BetterFirstSearchFieldsValidation = BetterFirstSearchFieldsValidation = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'betterFirstSearchFieldsValidation', async: false }),
    (0, common_1.Injectable)()
], BetterFirstSearchFieldsValidation);
//# sourceMappingURL=BetterFirstSearchFieldsValidation.validator.js.map