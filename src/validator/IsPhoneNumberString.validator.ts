import { registerDecorator, ValidationOptions } from "class-validator";
import { 
    PhoneNumberRegex, 
    PhoneNumberType, 
    PhoneNumberTypeToRegion, 
} from "../types/index";
import { ServerAllowedPhoneNumberException } from "../exceptions";


export function IsPhoneNumberString(phoneNumberType: PhoneNumberType, allowedPhoneNumberTypes: PhoneNumberType[], validationOptions?: ValidationOptions) {
    if (!allowedPhoneNumberTypes.includes(phoneNumberType)) {
        throw ServerAllowedPhoneNumberException;
    }

    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsPhoneNumberString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a type of the phone number in ${PhoneNumberTypeToRegion[phoneNumberType]}`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    return (
                        typeof value === 'string' &&
                        PhoneNumberRegex[phoneNumberType].test(value)
                    );
                }
            }
        });
    };
}