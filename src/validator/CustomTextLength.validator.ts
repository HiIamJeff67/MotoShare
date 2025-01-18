import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {
    validate(text: string, validationArguments: ValidationArguments) {
        if (!text) return false;
        return text.length > validationArguments.constraints[0] && text.length < validationArguments.constraints[1];
    }
}