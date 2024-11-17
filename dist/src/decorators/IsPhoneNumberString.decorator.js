"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPhoneNumberString = IsPhoneNumberString;
const class_validator_1 = require("class-validator");
const index_1 = require("../types/index");
const exceptions_1 = require("../exceptions");
function IsPhoneNumberString(phoneNumberType, allowedPhoneNumberTypes, validationOptions) {
    if (!allowedPhoneNumberTypes.includes(phoneNumberType)) {
        throw exceptions_1.ServerAllowedPhoneNumberException;
    }
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsPhoneNumberString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a type of the phone number in ${index_1.PhoneNumberTypeToRegion[phoneNumberType]}`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    return (typeof value === 'string' &&
                        index_1.PhoneNumberRegex[phoneNumberType].test(value));
                }
            }
        });
    };
}
//# sourceMappingURL=IsPhoneNumberString.decorator.js.map