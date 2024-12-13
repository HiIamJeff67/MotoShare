import { ConflictException, ForbiddenException, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FileSizeUnitType } from "../types";
export declare const ClientInvalidTokenException: UnauthorizedException;
export declare const ClientTokenExpiredException: UnauthorizedException;
export declare const ClientUserHasNoAccessException: UnauthorizedException;
export declare const ClientAuthCodeNotPairException: NotAcceptableException;
export declare const ClientAuthCodeExpiredException: NotAcceptableException;
export declare const ClientOldPasswordNotMatchException: NotAcceptableException;
export declare const ClientDeleteAccountPasswordNotMatchException: NotAcceptableException;
export declare const ClientWithoutAdvanceAuthorizedUserException: UnauthorizedException;
export declare const ClientUserAuthenticatedMethodNotAllowedException: UnauthorizedException;
export declare const ClientInvalidGoogleIdTokenException: UnauthorizedException;
export declare const ClientPassengerNotFoundException: NotFoundException;
export declare const ClientRidderNotFoundException: NotFoundException;
export declare const ClientInviteNotFoundException: NotFoundException;
export declare const ClientPurchaseOrderNotFoundException: NotFoundException;
export declare const ClientSupplyOrderNotFoundException: NotFoundException;
export declare const ClientOrderNotFoundException: NotFoundException;
export declare const ClientCollectionNotFoundException: NotFoundException;
export declare const ClientSignInUserNameNotFoundException: NotFoundException;
export declare const ClientSignInEmailNotFoundException: NotFoundException;
export declare const ClientHistoryNotFoundException: NotFoundException;
export declare const ClientPassengerNotificationNotFoundException: NotFoundException;
export declare const ClientRidderNotificationNotFoundException: NotFoundException;
export declare const ClientPassengerPreferenceNotFoundException: NotFoundException;
export declare const ClientRidderPreferenceNotFoundException: NotFoundException;
export declare const ClientPeriodicPurchaseOrderNotFoundException: NotFoundException;
export declare const ClientPeriodicSupplyOrderNotFoundException: NotFoundException;
export declare const ClientSignInUserException: ForbiddenException;
export declare const ClientSignInPasswordNotMatchException: ForbiddenException;
export declare const ClientSignUpUserException: ForbiddenException;
export declare const ClientDuplicateFieldDetectedException: (errorMessage: string | undefined) => ConflictException;
export declare const ClientCreatePurchaseOrderException: ForbiddenException;
export declare const ClientCreateSupplyOrderException: ForbiddenException;
export declare const ClientCreatePassengerInviteException: ForbiddenException;
export declare const ClientCreateRidderInviteException: ForbiddenException;
export declare const ClientCreateOrderException: ForbiddenException;
export declare const ClientCreatePassengerInfoException: ForbiddenException;
export declare const ClientCreateRidderInfoException: ForbiddenException;
export declare const ClientCreatePassengerCollectionException: ForbiddenException;
export declare const ClientCreateRidderCollectionException: ForbiddenException;
export declare const ClientCreateHistoryException: ForbiddenException;
export declare const ClientCreatePassengerAuthException: ForbiddenException;
export declare const ClientCreateRidderAuthException: ForbiddenException;
export declare const ClientCreatePassengerNotificationException: ForbiddenException;
export declare const ClientCreateRidderNotificationException: ForbiddenException;
export declare const ClientCreatePassengerPreferenceException: ForbiddenException;
export declare const ClientCreateRidderPreferenceException: ForbiddenException;
export declare const ClientCreatePeriodicPurchaseOrderException: ForbiddenException;
export declare const ClientCreatePeriodicSupplyOrderException: ForbiddenException;
export declare const ClientNoChangeOnUserNameException: ConflictException;
export declare const ClientNoChangeOnEmailException: ConflictException;
export declare const ClientNoChangeOnPasswordException: ConflictException;
export declare const ClientEndBeforeStartException: ConflictException;
export declare const ClientUploadFileExceedException: (maxSize: number, unit: FileSizeUnitType) => NotAcceptableException;
export declare const ClientUploadFileMimeTypeException: (validMimeType: string[]) => NotAcceptableException;
export declare const ClientUnknownException: InternalServerErrorException;
