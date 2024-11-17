"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNewTWLicenseString = IsNewTWLicenseString;
exports.IsLooseTWLicenseString = IsLooseTWLicenseString;
const class_validator_1 = require("class-validator");
const types_1 = require("../types");
function IsNewTWLicenseString(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsNewTWLicenseString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a new form(8th gen) of the license in Taiwan`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    if (typeof value === 'string') {
                        for (const regex of types_1.TWLicenseRegex) {
                            if (regex.test(value))
                                return true;
                        }
                    }
                    return false;
                }
            }
        });
    };
}
function IsLooseTWLicenseString(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsLooseTWLicenseString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a form of the license in Taiwan`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    if (typeof value === 'string'
                        && types_1.ValidLicenseLengths.includes(value.length)
                        && value.includes('-')
                        && !value.startsWith('-')
                        && !value.endsWith('-')) {
                        const parts = value.split('-');
                        if (parts.length !== 2)
                            return false;
                        const alphaNumericRegex = /^[A-Z0-9]+$/;
                        return alphaNumericRegex.test(parts[0]) && alphaNumericRegex.test(parts[1]);
                    }
                    return false;
                }
            }
        });
    };
}
//# sourceMappingURL=IsLicenseString.decorator.js.map