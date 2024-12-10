"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotEqualTo = IsNotEqualTo;
const class_validator_1 = require("class-validator");
function IsNotEqualTo(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: "isNotEqualTo",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value !== relatedValue;
                },
                defaultMessage(args) {
                    const relatedPropertyName = args.constraints[0];
                    return `${args.property} should not be equal to ${relatedPropertyName}`;
                },
            },
        });
    };
}
//# sourceMappingURL=IsNotEqualTo.decorator.js.map