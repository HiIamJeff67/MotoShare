import { ValidationOptions } from "class-validator";
export declare function MinNumberString(minValue: number, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function MaxNumberString(maxValue: number, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
