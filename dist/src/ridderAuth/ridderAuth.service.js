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
exports.RidderAuthService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const email_service_1 = require("../email/email.service");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const exceptions_1 = require("../exceptions");
const ridderAuth_schema_1 = require("../drizzle/schema/ridderAuth.schema");
const drizzle_orm_1 = require("drizzle-orm");
let RidderAuthService = class RidderAuthService {
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
            const responseOfSelectingRidder = await tx.select({
                userName: ridder_schema_1.RidderTable.userName,
                email: ridder_schema_1.RidderTable.email,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .limit(1);
            if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            const responseOfUpdatingAuthCode = await tx.update(ridderAuth_schema_1.RidderAuthTable).set({
                authCode: this._generateAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).where((0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, id))
                .returning({
                authCode: ridderAuth_schema_1.RidderAuthTable.authCode,
                authCodeExpiredAt: ridderAuth_schema_1.RidderAuthTable.authCodeExpiredAt,
            });
            if (!responseOfUpdatingAuthCode || responseOfUpdatingAuthCode.length === 0) {
                throw exceptions_1.ApiGenerateAuthCodeException;
            }
            const responseOfSendingEamil = await this.email.sendValidationEamil(responseOfSelectingRidder[0].email, {
                title: title,
                userName: responseOfSelectingRidder[0].userName,
                validationCode: responseOfUpdatingAuthCode[0].authCode,
            });
            if (!responseOfSendingEamil || responseOfSendingEamil.length === 0) {
                throw exceptions_1.ApiSendEmailForValidationException;
            }
            return [{
                    email: responseOfSelectingRidder[0].email,
                    authCodeExpiredAt: responseOfUpdatingAuthCode[0].authCodeExpiredAt,
                }];
        });
    }
    async validateAuthCodeForEmail(id, validateRidderInfoDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingRidderAuth = await tx.select({
                authCode: ridderAuth_schema_1.RidderAuthTable.authCode,
                authCodeExpiredAt: ridderAuth_schema_1.RidderAuthTable.authCodeExpiredAt,
            }).from(ridderAuth_schema_1.RidderAuthTable)
                .where((0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            if (responseOfSelectingRidderAuth[0].authCode !== validateRidderInfoDto.authCode) {
                throw exceptions_1.ClientAuthCodeNotPairException;
            }
            if (responseOfSelectingRidderAuth[0].authCodeExpiredAt <= new Date()) {
                throw exceptions_1.ClientAuthCodeExpiredException;
            }
            return await tx.update(ridderAuth_schema_1.RidderAuthTable).set({
                isEmailAuthenticated: true,
            }).where((0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, id))
                .returning({
                isEmailAuthenticated: ridderAuth_schema_1.RidderAuthTable.isEmailAuthenticated,
            });
        });
    }
    async validateAuthCodeToResetForgottenPassword(id, resetRidderPasswordDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingRidderAuth = await tx.select({
                authCode: ridderAuth_schema_1.RidderAuthTable.authCode,
                authCodeExpiredAt: ridderAuth_schema_1.RidderAuthTable.authCodeExpiredAt,
            }).from(ridderAuth_schema_1.RidderAuthTable)
                .where((0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            if (responseOfSelectingRidderAuth[0].authCode !== resetRidderPasswordDto.authCode) {
                throw exceptions_1.ClientAuthCodeNotPairException;
            }
            if (responseOfSelectingRidderAuth[0].authCodeExpiredAt <= new Date()) {
                throw exceptions_1.ClientAuthCodeExpiredException;
            }
            const responseOfSelectingRidder = await tx.select({
                id: ridder_schema_1.RidderTable.id,
                hash: ridder_schema_1.RidderTable.password,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .limit(1);
            if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            const pwMatches = await bcrypt.compare(resetRidderPasswordDto.password, responseOfSelectingRidder[0].hash);
            if (pwMatches)
                throw exceptions_1.ClientNoChangeOnPasswordException;
            const hash = await bcrypt.hash(resetRidderPasswordDto.password, Number(this.config.get("SALT_OR_ROUND")));
            return await tx.update(ridder_schema_1.RidderTable).set({
                password: hash,
            }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .returning({
                userName: ridder_schema_1.RidderTable.userName,
                email: ridder_schema_1.RidderTable.email,
            });
        });
    }
    async validateAuthCodeToResetEmailOrPassword(id, updateRidderEmailPasswordDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingRidderAuth = await tx.select({
                authCode: ridderAuth_schema_1.RidderAuthTable.authCode,
                authCodeExpiredAt: ridderAuth_schema_1.RidderAuthTable.authCodeExpiredAt,
            }).from(ridderAuth_schema_1.RidderAuthTable)
                .where((0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, id))
                .limit(1);
            if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            if (responseOfSelectingRidderAuth[0].authCode !== updateRidderEmailPasswordDto.authCode) {
                throw exceptions_1.ClientAuthCodeNotPairException;
            }
            if (responseOfSelectingRidderAuth[0].authCodeExpiredAt <= new Date()) {
                throw exceptions_1.ClientAuthCodeExpiredException;
            }
            const responseOfSelectingRidder = await tx.select({
                id: ridder_schema_1.RidderTable.id,
                email: ridder_schema_1.RidderTable.email,
                hash: ridder_schema_1.RidderTable.password,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .limit(1);
            if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            let flag = false;
            if (updateRidderEmailPasswordDto.email && updateRidderEmailPasswordDto.email.length !== 0) {
                flag = true;
                const emMatches = updateRidderEmailPasswordDto.email === responseOfSelectingRidder[0].email;
                if (emMatches)
                    throw exceptions_1.ClientNoChangeOnEmailException;
            }
            if (updateRidderEmailPasswordDto.oldPassword && updateRidderEmailPasswordDto.oldPassword.length !== 0
                && updateRidderEmailPasswordDto.newPassword && updateRidderEmailPasswordDto.newPassword.length !== 0
                && updateRidderEmailPasswordDto.oldPassword !== updateRidderEmailPasswordDto.newPassword) {
                const oldPwMatches = await bcrypt.compare(updateRidderEmailPasswordDto.oldPassword, responseOfSelectingRidder[0].hash);
                if (!oldPwMatches)
                    throw exceptions_1.ClientOldPasswordNotMatchException;
                const newPwMatches = await bcrypt.compare(updateRidderEmailPasswordDto.newPassword, responseOfSelectingRidder[0].hash);
                if (newPwMatches)
                    throw exceptions_1.ClientNoChangeOnPasswordException;
                const hash = await bcrypt.hash(updateRidderEmailPasswordDto.newPassword, Number(this.config.get("SALT_OR_ROUND")));
                return await tx.update(ridder_schema_1.RidderTable).set({
                    ...(flag ? { email: updateRidderEmailPasswordDto.email, } : {}),
                    password: hash,
                }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                    .returning({
                    userName: ridder_schema_1.RidderTable.userName,
                    email: ridder_schema_1.RidderTable.email,
                });
            }
            if (!flag)
                throw exceptions_1.ApiMissingBodyOrWrongDtoException;
            return await tx.update(ridder_schema_1.RidderTable).set({
                email: updateRidderEmailPasswordDto.email,
            }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .returning({
                userName: ridder_schema_1.RidderTable.userName,
                email: ridder_schema_1.RidderTable.email,
            });
        });
    }
};
exports.RidderAuthService = RidderAuthService;
exports.RidderAuthService = RidderAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.EmailService, Object])
], RidderAuthService);
//# sourceMappingURL=ridderAuth.service.js.map