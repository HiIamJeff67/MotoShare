"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAfterNow = IsAfterNow;
const class_validator_1 = require("class-validator");
function IsAfterNow(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsAfterNow',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be after now`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    const now = new Date();
                    const dateValue = new Date(value);
                    return isNaN(dateValue.getTime()) ? false : (dateValue > now);
                }
            }
        });
    };
}
//# sourceMappingURL=IsAfterNow.validator.js.map