"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerAuthService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passengerAuth_schema_1 = require("../drizzle/schema/passengerAuth.schema");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
const email_service_1 = require("../email/email.service");
const auth_constant_1 = require("../constants/auth.constant");
const utils_1 = require("../utils");
let PassengerAuthService = class PassengerAuthService {
    constructor(config, email, db) {
        this.config = config;
        this.email = email;
        this.db = db;
    }
    _generateAuthCode() {
        let randomAuthCode = Math.floor(Math.random() * Math.pow(10, Number(this.config.get("AUTH_CODE_LENGTH")))).toString();
        while (randomAuthCode.length < 6)
            randomAuthCode = "0" + randomAuthCode;
        return randomAuthCode;
    }
    async sendAuthenticationCodeById(id, title) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassenger = await tx.select({
                userName: passenger_schema_1.PassengerTable.userName,
                email: passenger_schema_1.PassengerTable.email,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .limit(1);
            if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            const responseOfUpdatingAuthCode = await tx.update(passengerAuth_schema_1.PassengerAuthTable).set({
                authCode: this._generateAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id))
                .returning({
                authCode: passengerAuth_schema_1.PassengerAuthTable.authCode,
                authCodeExpiredAt: passengerAuth_schema_1.PassengerAuthTable.authCodeExpiredAt,
            });
            if (!responseOfUpdatingAuthCode || responseOfUpdatingAuthCode.length === 0) {
                throw exceptions_1.ApiGenerateAuthCodeException;
            }
            const responseOfSendingEamil = await this.email.sendValidationEamil(responseOfSelectingPassenger[0].email, {
                title: title,
                userName: responseOfSelectingPassenger[0].userName,
                validationCode: responseOfUpdatingAuthCode[0].authCode,
            });
            if (!responseOfSendingEamil || responseOfSendingEamil.length === 0) {
                throw exceptions_1.ApiSendEmailForValidationException;
            }
            return [{
                    email: responseOfSelectingPassenger[0].email,
                    authCodeExpiredAt: responseOfUpdatingAuthCode[0].authCodeExpiredAt,
                }];
        });
    }
    async validateAuthCodeForEmail(id, validatePassengerInfoDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassengerAuth = await tx.select({
                authCode: passengerAuth_schema_1.PassengerAuthTable.authCode,
                authCodeExpiredAt: passengerAuth_schema_1.PassengerAuthTable.authCodeExpiredAt,
            }).from(passengerAuth_schema_1.PassengerAuthTable)
                .where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            if (responseOfSelectingPassengerAuth[0].authCode !== validatePassengerInfoDto.authCode) {
                throw exceptions_1.ClientAuthCodeNotPairException;
            }
            if (responseOfSelectingPassengerAuth[0].authCodeExpiredAt <= new Date()) {
                throw exceptions_1.ClientAuthCodeExpiredException;
            }
            return await tx.update(passengerAuth_schema_1.PassengerAuthTable).set({
                isEmailAuthenticated: true,
                authCode: "USED",
                authCodeExpiredAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id))
                .returning({
                isEmailAuthenticated: passengerAuth_schema_1.PassengerAuthTable.isEmailAuthenticated,
            });
        });
    }
    async validateAuthCodeToResetForgottenPassword(id, resetPassengerPasswordDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassengerAuth = await tx.select({
                authCode: passengerAuth_schema_1.PassengerAuthTable.authCode,
                authCodeExpiredAt: passengerAuth_schema_1.PassengerAuthTable.authCodeExpiredAt,
            }).from(passengerAuth_schema_1.PassengerAuthTable)
                .where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            if (responseOfSelectingPassengerAuth[0].authCode !== resetPassengerPasswordDto.authCode) {
                throw exceptions_1.ClientAuthCodeNotPairException;
            }
            if (responseOfSelectingPassengerAuth[0].authCodeExpiredAt <= new Date()) {
                throw exceptions_1.ClientAuthCodeExpiredException;
            }
            await tx.update(passengerAuth_schema_1.PassengerAuthTable).set({
                authCode: "USED",
                authCodeExpiredAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id));
            const responseOfSelectingPassenger = await tx.select({
                id: passenger_schema_1.PassengerTable.id,
                hash: passenger_schema_1.PassengerTable.password,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .limit(1);
            if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            const pwMatches = await bcrypt.compare(resetPassengerPasswordDto.password, responseOfSelectingPassenger[0].hash);
            if (pwMatches)
                throw exceptions_1.ClientNoChangeOnPasswordException;
            const hash = await bcrypt.hash(resetPassengerPasswordDto.password, Number(this.config.get("SALT_OR_ROUND")));
            return await tx.update(passenger_schema_1.PassengerTable).set({
                password: hash,
                accessToken: auth_constant_1.TEMP_ACCESS_TOKEN,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .returning({
                userName: passenger_schema_1.PassengerTable.userName,
                email: passenger_schema_1.PassengerTable.email,
            });
        });
    }
    async validateAuthCodeToResetEmailOrPassword(id, updatePassengerEmailPasswordDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassengerAuth = await tx.select({
                authCode: passengerAuth_schema_1.PassengerAuthTable.authCode,
                authCodeExpiredAt: passengerAuth_schema_1.PassengerAuthTable.authCodeExpiredAt,
            }).from(passengerAuth_schema_1.PassengerAuthTable)
                .where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            if (responseOfSelectingPassengerAuth[0].authCode !== updatePassengerEmailPasswordDto.authCode) {
                throw exceptions_1.ClientAuthCodeNotPairException;
            }
            if (responseOfSelectingPassengerAuth[0].authCodeExpiredAt <= new Date()) {
                throw exceptions_1.ClientAuthCodeExpiredException;
            }
            await tx.update(passengerAuth_schema_1.PassengerAuthTable).set({
                authCode: "USED",
                authCodeExpiredAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id));
            const responseOfSelectingPassenger = await tx.select({
                id: passenger_schema_1.PassengerTable.id,
                email: passenger_schema_1.PassengerTable.email,
                hash: passenger_schema_1.PassengerTable.password,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .limit(1);
            if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            let flag = false;
            if (updatePassengerEmailPasswordDto.email && updatePassengerEmailPasswordDto.email.length !== 0) {
                flag = true;
                const emMatches = updatePassengerEmailPasswordDto.email === responseOfSelectingPassenger[0].email;
                if (emMatches)
                    throw exceptions_1.ClientNoChangeOnEmailException;
            }
            if (updatePassengerEmailPasswordDto.oldPassword && updatePassengerEmailPasswordDto.oldPassword.length !== 0
                && updatePassengerEmailPasswordDto.newPassword && updatePassengerEmailPasswordDto.newPassword.length !== 0
                && updatePassengerEmailPasswordDto.oldPassword !== updatePassengerEmailPasswordDto.newPassword) {
                const oldPwMatches = await bcrypt.compare(updatePassengerEmailPasswordDto.oldPassword, responseOfSelectingPassenger[0].hash);
                if (!oldPwMatches)
                    throw exceptions_1.ClientOldPasswordNotMatchException;
                const newPwMatches = await bcrypt.compare(updatePassengerEmailPasswordDto.newPassword, responseOfSelectingPassenger[0].hash);
                if (newPwMatches)
                    throw exceptions_1.ClientNoChangeOnPasswordException;
                const hash = await bcrypt.hash(updatePassengerEmailPasswordDto.newPassword, Number(this.config.get("SALT_OR_ROUND")));
                return await tx.update(passenger_schema_1.PassengerTable).set({
                    ...(flag ? { email: updatePassengerEmailPasswordDto.email, } : {}),
                    password: hash,
                    accessToken: auth_constant_1.TEMP_ACCESS_TOKEN,
                }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                    .returning({
                    userName: passenger_schema_1.PassengerTable.userName,
                    email: passenger_schema_1.PassengerTable.email,
                });
            }
            if (!flag)
                throw exceptions_1.ApiMissingBodyOrWrongDtoException;
            return await tx.update(passenger_schema_1.PassengerTable).set({
                email: updatePassengerEmailPasswordDto.email,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .returning({
                userName: passenger_schema_1.PassengerTable.userName,
                email: passenger_schema_1.PassengerTable.email,
            });
        });
    }
    async bindDefaultAuth(id, bindPassengerDefaultAuthDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassengerAuth = await tx.select({
                isDefaultAuthenticated: passengerAuth_schema_1.PassengerAuthTable.isDefaultAuthenticated,
            }).from(passengerAuth_schema_1.PassengerAuthTable)
                .where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            if (responseOfSelectingPassengerAuth[0].isDefaultAuthenticated) {
                throw exceptions_1.ClientUserDefaultAuthAlreadyBoundException;
            }
            const responseOfUpdatingPassengerAuth = await tx.update(passengerAuth_schema_1.PassengerAuthTable).set({
                isDefaultAuthenticated: true,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .returning();
            if (!responseOfUpdatingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            const hash = await bcrypt.hash(bindPassengerDefaultAuthDto.password, Number(this.config.get("SALT_OR_ROUND")));
            return await tx.update(passenger_schema_1.PassengerTable).set({
                email: bindPassengerDefaultAuthDto.email,
                password: hash,
                accessToken: auth_constant_1.TEMP_ACCESS_TOKEN,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .returning({
                userName: passenger_schema_1.PassengerTable.userName,
                email: passenger_schema_1.PassengerTable.email,
            });
        });
    }
    async bindGoogleAuth(id, bindPassengerGoogleAuthDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassengerAuth = await tx.select({
                googleId: passengerAuth_schema_1.PassengerAuthTable.googleId,
            }).from(passengerAuth_schema_1.PassengerAuthTable)
                .where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            if (responseOfSelectingPassengerAuth[0].googleId || responseOfSelectingPassengerAuth[0].googleId !== null
                || responseOfSelectingPassengerAuth[0].googleId !== "") {
                throw exceptions_1.ClientUserGoogleAuthAlreadyBoundException;
            }
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl)
                throw exceptions_1.ServerExtractGoogleAuthUrlEnvVariableException;
            const parseDataFromGoogleToken = await fetch(googleAuthUrl + bindPassengerGoogleAuthDto.idToken);
            if (!parseDataFromGoogleToken || !parseDataFromGoogleToken["email"] || !parseDataFromGoogleToken["sub"]) {
                throw exceptions_1.ClientInvalidGoogleIdTokenException;
            }
            const responseOfUpdatingPassengerAuth = await tx.update(passengerAuth_schema_1.PassengerAuthTable).set({
                googleId: parseDataFromGoogleToken["sub"],
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .returning();
            if (!responseOfUpdatingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            const responseOfSelectingPassenger = await tx.select({
                userName: passenger_schema_1.PassengerTable.userName,
                email: passenger_schema_1.PassengerTable.email,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .limit(1);
            if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            if ((0, utils_1.isTempEmail)(responseOfSelectingPassenger[0].email)) {
                return await tx.update(passenger_schema_1.PassengerTable).set({
                    email: parseDataFromGoogleToken["email"],
                }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                    .returning({
                    userName: passenger_schema_1.PassengerTable.userName,
                    email: passenger_schema_1.PassengerTable.email,
                });
            }
            return responseOfSelectingPassenger;
        });
    }
};
exports.PassengerAuthService = PassengerAuthService;
exports.PassengerAuthService = PassengerAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.EmailService, Object])
], PassengerAuthService);
//# sourceMappingURL=passengerAuth.service.js.map