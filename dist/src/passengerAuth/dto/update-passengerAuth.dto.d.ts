import { CreatePassengerEmailPasswordDto } from './create-passengerAuth.dto';
export declare class ValidatePassengerInfoDto {
    authCode: string;
}
export declare class ResetPassengerPasswordDto {
    authCode: string;
    password: string;
}
declare const UpdatePassengerEmailPasswordDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePassengerEmailPasswordDto>>;
export declare class UpdatePassengerEmailPasswordDto extends UpdatePassengerEmailPasswordDto_base {
    authCode: string;
}
export {};
