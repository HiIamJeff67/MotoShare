"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOnlyDate = IsOnlyDate;
const class_validator_1 = require("class-validator");
function IsOnlyDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsOnlyDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: 'Please provide only date like 2020-12-08',
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
                    return typeof value === 'string' && regex.test(value);
                },
            },
        });
    };
}
//# sourceMappingURL=IsDateTimeString.decorator.js.map