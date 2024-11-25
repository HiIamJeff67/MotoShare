import { BadRequestException, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
export declare const ApiMissingParameterException: BadRequestException;
export declare const ApiMissingBodyOrWrongDtoException: BadRequestException;
export declare const ApiSearchingLimitTooLarge: (maxLimit: number) => NotAcceptableException;
export declare const ApiPrevOrderIdFormException: NotAcceptableException;
export declare const ApiGeneratingBearerTokenException: InternalServerErrorException;
export declare const ApiGenerateAuthCodeException: InternalServerErrorException;
export declare const ApiSendEmailForValidationException: InternalServerErrorException;
export declare const ApiUnknownException: InternalServerErrorException;
