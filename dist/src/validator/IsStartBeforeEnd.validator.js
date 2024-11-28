"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsStartBeforeEnd = IsStartBeforeEnd;
const class_validator_1 = require("class-validator");
function IsStartBeforeEnd(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsStartBeforeEnd',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: "The startAfter must be earlier than the endedAt",
                ...validationOptions
            },
            constraints: [property],
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return new Date(value) < new Date(relatedValue);
                },
            }
        });
    };
}
//# sourceMappingURL=IsStartBeforeEnd.validator.js.map