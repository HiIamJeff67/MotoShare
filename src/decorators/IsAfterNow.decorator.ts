import { registerDecorator, ValidationOptions } from "class-validator";

export function IsAfterNow(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsAfterNow',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be after now`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    const now = new Date();
                    const dateValue = new Date(value);

                    return isNaN(dateValue.getTime()) ? false : (dateValue > now);
                }
            }
        });
    }
}