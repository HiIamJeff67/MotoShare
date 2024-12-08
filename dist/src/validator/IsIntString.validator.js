"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsIntString = IsIntString;
const class_validator_1 = require("class-validator");
function IsIntString(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsIntString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a string of integer`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    return (typeof value === 'string' &&
                        /^-?\d+$/.test(value));
                }
            },
        });
    };
}
//# sourceMappingURL=IsIntString.validator.js.map