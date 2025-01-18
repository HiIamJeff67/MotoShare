import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
export declare class CustomTextLength implements ValidatorConstraintInterface {
    validate(text: string, validationArguments: ValidationArguments): boolean;
}
