import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function IsEndAfterStart(property: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsEndAfterStart',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: "The startAfter must be earlier than the endedAt",
                ...validationOptions
            },
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    // if (!value || !relatedValue) return true;    // uncomment this if the the property is optional

                    return new Date(value) > new Date(relatedValue);
                },
            }
        })
    }
}