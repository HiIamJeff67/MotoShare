import { registerDecorator, ValidationOptions } from "class-validator";

export function MinNumberString(minValue: number, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'MinNumberString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be not less than ${minValue}`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    const numericValue = parseFloat(value);
                    
                    return (
                        typeof value === 'string' &&
                        !isNaN(numericValue) &&
                        numericValue >= minValue
                    );
                },
            },
        });
    };
}

export function MaxNumberString(maxValue: number, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'MinNumberString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be not greater than ${maxValue}`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    const numericValue = parseFloat(value);

                    return (
                        typeof value === 'string' &&
                        !isNaN(numericValue) &&
                        numericValue <= maxValue
                    );
                },
            },
        });
    };
}
