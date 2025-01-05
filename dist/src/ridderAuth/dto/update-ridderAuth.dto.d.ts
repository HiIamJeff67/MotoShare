import { CreateRidderEmailPasswordDto } from './create-ridderAuth.dto';
export declare class ValidateRidderInfoDto {
    authCode: string;
}
export declare class ResetRidderPasswordDto {
    email: string;
    authCode: string;
    password: string;
}
declare const UpdateRidderEmailPasswordDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRidderEmailPasswordDto>>;
export declare class UpdateRidderEmailPasswordDto extends UpdateRidderEmailPasswordDto_base {
    authCode: string;
}
export declare class BindRidderDefaultAuthDto {
    email: string;
    password: string;
}
export declare class BindRidderGoogleAuthDto {
    idToken: string;
}
export {};
