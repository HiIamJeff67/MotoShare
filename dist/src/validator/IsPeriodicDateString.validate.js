"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPeriodicDateString = IsPeriodicDateString;
const class_validator_1 = require("class-validator");
function IsPeriodicDateString(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsPeriodicDateString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be this form of date: 9999-12-31THH:MM:SS.MSZ, since for periodic datetime, it only considers the time excluded its date.`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    const regex = /^9999-12-31T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
                    return (typeof value === 'string' &&
                        regex.test(value));
                },
            },
        });
    };
}
//# sourceMappingURL=IsPeriodicDateString.validate.js.map