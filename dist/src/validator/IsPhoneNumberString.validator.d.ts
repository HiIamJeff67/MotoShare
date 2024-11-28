import { ValidationOptions } from "class-validator";
import { PhoneNumberType } from "../types/index";
export declare function IsPhoneNumberString(phoneNumberType: PhoneNumberType, allowedPhoneNumberTypes: PhoneNumberType[], validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
