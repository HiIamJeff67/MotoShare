import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class BetterFirstSearchFieldsValidation implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
