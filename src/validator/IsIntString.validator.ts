import { registerDecorator, ValidationOptions } from "class-validator";

export function IsIntString(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsIntString', 
            target: object.constructor, 
            propertyName: propertyName, 
            constraints: [], 
            options: {
                message: `${propertyName} must be a string of integer`, 
                ...validationOptions, 
            }, 
            validator: {
                validate(value: any) {
                    return (
                        typeof value === 'string' &&
                        /^-?\d+$/.test(value)
                    );
                }
            },
        });
    };
}