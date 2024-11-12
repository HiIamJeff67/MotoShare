import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
export declare const ApiMissingParameterException: BadRequestException;
export declare const ApiMissingBodyOrWrongDtoException: BadRequestException;
export declare const ApiUnknownException: InternalServerErrorException;
