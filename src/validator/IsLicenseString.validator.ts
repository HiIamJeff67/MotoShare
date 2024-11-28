import { registerDecorator, ValidationOptions } from "class-validator";
import { TWLicenseRegex, ValidLicenseLengths } from "../types";

export function IsNewTWLicenseString(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsNewTWLicenseString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a new form(8th gen) of the license in Taiwan`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    if (typeof value === 'string') {
                        for (const regex of TWLicenseRegex) {
                            if (regex.test(value)) return true;
                        }
                    }
                    return false;
                }
            }
        })
    }
}

export function IsLooseTWLicenseString(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsLooseTWLicenseString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} must be a form of the license in Taiwan`,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    if (typeof value === 'string' 
                        && ValidLicenseLengths.includes(value.length)
                        && value.includes('-') 
                        && !value.startsWith('-') 
                        && !value.endsWith('-')
                    ) {
                        const parts = value.split('-');
                        if (parts.length !== 2) return false;
                        const alphaNumericRegex = /^[A-Z0-9]+$/
                        return alphaNumericRegex.test(parts[0]) && alphaNumericRegex.test(parts[1]);
                    }
                    return false;
                }
            }
        })
    }
}