import { ValidationOptions } from 'class-validator';
export declare function IsOnlyDate(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function MinNumberString(minValue: number, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
