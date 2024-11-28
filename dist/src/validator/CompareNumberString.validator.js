"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinNumberString = MinNumberString;
exports.MaxNumberString = MaxNumberString;
const class_validator_1 = require("class-validator");
function MinNumberString(minValue, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'MinNumberString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be not less than ${minValue}`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    const numericValue = parseFloat(value);
                    return (typeof value === 'string' &&
                        !isNaN(numericValue) &&
                        numericValue >= minValue);
                },
            },
        });
    };
}
function MaxNumberString(maxValue, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'MinNumberString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be not greater than ${maxValue}`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    const numericValue = parseFloat(value);
                    return (typeof value === 'string' &&
                        !isNaN(numericValue) &&
                        numericValue <= maxValue);
                },
            },
        });
    };
}
//# sourceMappingURL=CompareNumberString.validator.js.map