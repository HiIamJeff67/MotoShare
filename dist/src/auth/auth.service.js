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
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const drizzle_module_1 = require("../../src/drizzle/drizzle.module");
const exceptions_1 = require("../exceptions");
const passenger_schema_1 = require("../../src/drizzle/schema/passenger.schema");
const passengerInfo_schema_1 = require("../../src/drizzle/schema/passengerInfo.schema");
const ridder_schema_1 = require("../../src/drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const passengerAuth_schema_1 = require("../drizzle/schema/passengerAuth.schema");
const ridderAuth_schema_1 = require("../drizzle/schema/ridderAuth.schema");
const passengerRecord_schema_1 = require("../drizzle/schema/passengerRecord.schema");
const ridderRecord_schema_1 = require("../drizzle/schema/ridderRecord.schema");
let AuthService = class AuthService {
    constructor(config, db, jwt) {
        this.config = config;
        this.db = db;
        this.jwt = jwt;
    }
    async signUpPassengerWithUserNameAndEmailAndPassword(signUpDto) {
        return await this.db.transaction(async (tx) => {
            const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));
            const tempAccessToken = await this._tempSignToken(signUpDto.userName, signUpDto.email);
            const responseOfCreatingPassenger = await tx.insert(passenger_schema_1.PassengerTable).values({
                userName: signUpDto.userName,
                email: signUpDto.email,
                password: hash,
                accessToken: tempAccessToken.accessToken,
            }).returning({
                id: passenger_schema_1.PassengerTable.id,
                email: passenger_schema_1.PassengerTable.email,
            });
            if (!responseOfCreatingPassenger || responseOfCreatingPassenger.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingPassengerInfo = await tx.insert(passengerInfo_schema_1.PassengerInfoTable).values({
                userId: responseOfCreatingPassenger[0].id,
            }).returning();
            if (!responseOfCreatingPassengerInfo || responseOfCreatingPassengerInfo.length === 0) {
                throw exceptions_1.ClientCreatePassengerInfoException;
            }
            const responseOfCreatingPassengerRecord = await tx.insert(passengerRecord_schema_1.PassengerRecordTable).values({
                userId: responseOfCreatingPassenger[0].id,
            }).returning();
            if (!responseOfCreatingPassengerRecord || responseOfCreatingPassengerRecord.length === 0) {
                throw exceptions_1.ClientCreatePassengerRecordException;
            }
            const result = await this._signToken(responseOfCreatingPassenger[0].id, responseOfCreatingPassenger[0].email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(passenger_schema_1.PassengerTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, responseOfCreatingPassenger[0].id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingPassengerAuth = await tx.insert(passengerAuth_schema_1.PassengerAuthTable).values({
                userId: responseOfCreatingPassenger[0].id,
                isDefaultAuthenticated: true,
                authCode: this._getRandomAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).returning();
            if (!responseOfCreatingPassengerAuth || responseOfCreatingPassengerAuth.length === 0) {
                throw exceptions_1.ClientCreatePassengerAuthException;
            }
            return result;
        });
    }
    async signUpPassengerWithGoogleAuth(googleSignUpDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl)
                throw exceptions_1.ServerExtractGoogleAuthUrlEnvVariableException;
            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignUpDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw exceptions_1.ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();
            const userName = await bcrypt.hash(googleSignUpDto.email.split('@')[0], Number(this.config.get("SALT_OR_ROUND_GOOGLE_USER_NAME")));
            const tempAccessToken = await this._tempSignToken(userName, googleSignUpDto.email);
            const responseOfCreatingPassenger = await tx.insert(passenger_schema_1.PassengerTable).values({
                userName: userName,
                email: googleSignUpDto.email,
                password: "",
                accessToken: tempAccessToken.accessToken,
            }).returning({
                id: passenger_schema_1.PassengerTable.id,
                email: passenger_schema_1.PassengerTable.email,
            });
            if (!responseOfCreatingPassenger || responseOfCreatingPassenger.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingPassengerInfo = await tx.insert(passengerInfo_schema_1.PassengerInfoTable).values({
                userId: responseOfCreatingPassenger[0].id,
            }).returning();
            if (!responseOfCreatingPassengerInfo || responseOfCreatingPassengerInfo.length === 0) {
                throw exceptions_1.ClientCreatePassengerInfoException;
            }
            const responseOfCreatingPassengerRecord = await tx.insert(passengerRecord_schema_1.PassengerRecordTable).values({
                userId: responseOfCreatingPassenger[0].id,
            }).returning();
            if (!responseOfCreatingPassengerRecord || responseOfCreatingPassengerRecord.length === 0) {
                throw exceptions_1.ClientCreatePassengerRecordException;
            }
            const result = await this._signToken(responseOfCreatingPassenger[0].id, responseOfCreatingPassenger[0].email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(passenger_schema_1.PassengerTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, responseOfCreatingPassenger[0].id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingPassengerAuth = await tx.insert(passengerAuth_schema_1.PassengerAuthTable).values({
                userId: responseOfCreatingPassenger[0].id,
                googleId: parseDataFromGoogleToken["sub"],
                authCode: this._getRandomAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).returning();
            if (!responseOfCreatingPassengerAuth || responseOfCreatingPassengerAuth.length === 0) {
                throw exceptions_1.ClientCreatePassengerAuthException;
            }
            return result;
        });
    }
    async signUpRidderWithUserNameAndEmailAndPassword(signUpDto) {
        return await this.db.transaction(async (tx) => {
            const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));
            const tempAccessToken = await this._tempSignToken(signUpDto.userName, signUpDto.email);
            const responseOfCreatingRidder = await tx.insert(ridder_schema_1.RidderTable).values({
                userName: signUpDto.userName,
                email: signUpDto.email,
                password: hash,
                accessToken: tempAccessToken.accessToken,
            }).returning({
                id: ridder_schema_1.RidderTable.id,
                email: ridder_schema_1.RidderTable.email,
            });
            if (!responseOfCreatingRidder || responseOfCreatingRidder.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingRidderInfo = await tx.insert(ridderInfo_schema_1.RidderInfoTable).values({
                userId: responseOfCreatingRidder[0].id,
            }).returning();
            if (!responseOfCreatingRidderInfo || responseOfCreatingRidderInfo.length === 0) {
                throw exceptions_1.ClientCreatePassengerInfoException;
            }
            const responseOfCreatingRidderRecord = await tx.insert(ridderRecord_schema_1.RidderRecordTable).values({
                userId: responseOfCreatingRidder[0].id,
            }).returning();
            if (!responseOfCreatingRidderRecord || responseOfCreatingRidderRecord.length === 0) {
                throw exceptions_1.ClientCreateRidderRecordException;
            }
            const result = await this._signToken(responseOfCreatingRidder[0].id, responseOfCreatingRidder[0].email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(ridder_schema_1.RidderTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, responseOfCreatingRidder[0].id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingRidderAuth = await tx.insert(ridderAuth_schema_1.RidderAuthTable).values({
                userId: responseOfCreatingRidder[0].id,
                isDefaultAuthenticated: true,
                authCode: this._getRandomAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).returning();
            if (!responseOfCreatingRidderAuth || responseOfCreatingRidderAuth.length === 0) {
                throw exceptions_1.ClientCreatePassengerAuthException;
            }
            return result;
        });
    }
    async signUpRidderWithGoogleAuth(googleSignUpDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl)
                throw exceptions_1.ServerExtractGoogleAuthUrlEnvVariableException;
            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignUpDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw exceptions_1.ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();
            const userName = await bcrypt.hash(googleSignUpDto.email.split('@')[0], Number(this.config.get("SALT_OR_ROUND_GOOGLE_USER_NAME")));
            const tempAccessToken = await this._tempSignToken(userName, googleSignUpDto.email);
            const responseOfCreatingRidder = await tx.insert(ridder_schema_1.RidderTable).values({
                userName: userName,
                email: googleSignUpDto.email,
                password: "",
                accessToken: tempAccessToken.accessToken,
            }).returning({
                id: ridder_schema_1.RidderTable.id,
                email: ridder_schema_1.RidderTable.email,
            });
            if (!responseOfCreatingRidder || responseOfCreatingRidder.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingRidderInfo = await tx.insert(ridderInfo_schema_1.RidderInfoTable).values({
                userId: responseOfCreatingRidder[0].id,
            }).returning();
            if (!responseOfCreatingRidderInfo || responseOfCreatingRidderInfo.length === 0) {
                throw exceptions_1.ClientCreatePassengerInfoException;
            }
            const responseOfCreatingRidderRecord = await tx.insert(ridderRecord_schema_1.RidderRecordTable).values({
                userId: responseOfCreatingRidder[0].id,
            }).returning();
            if (!responseOfCreatingRidderRecord || responseOfCreatingRidderRecord.length === 0) {
                throw exceptions_1.ClientCreateRidderRecordException;
            }
            const result = await this._signToken(responseOfCreatingRidder[0].id, responseOfCreatingRidder[0].email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(ridder_schema_1.RidderTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, responseOfCreatingRidder[0].id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            const responseOfCreatingRidderAuth = await tx.insert(ridderAuth_schema_1.RidderAuthTable).values({
                userId: responseOfCreatingRidder[0].id,
                googleId: parseDataFromGoogleToken["sub"],
                authCode: this._getRandomAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).returning();
            if (!responseOfCreatingRidderAuth || responseOfCreatingRidderAuth.length === 0) {
                throw exceptions_1.ClientCreatePassengerAuthException;
            }
            return result;
        });
    }
    async signInPassengerWithAccountAndPassword(signInDto) {
        return await this.db.transaction(async (tx) => {
            let userResponse = null;
            if (signInDto.userName) {
                userResponse = await tx.select({
                    id: passenger_schema_1.PassengerTable.id,
                    email: passenger_schema_1.PassengerTable.email,
                    hash: passenger_schema_1.PassengerTable.password,
                    isDefaultAuthenticated: passengerAuth_schema_1.PassengerAuthTable.isDefaultAuthenticated,
                }).from(passenger_schema_1.PassengerTable)
                    .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, signInDto.userName))
                    .leftJoin(passengerAuth_schema_1.PassengerAuthTable, (0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, passenger_schema_1.PassengerTable.id))
                    .limit(1);
                if (!userResponse || userResponse.length === 0) {
                    throw exceptions_1.ClientSignInUserNameNotFoundException;
                }
            }
            else if (signInDto.email) {
                userResponse = await tx.select({
                    id: passenger_schema_1.PassengerTable.id,
                    email: passenger_schema_1.PassengerTable.email,
                    hash: passenger_schema_1.PassengerTable.password,
                    isDefaultAuthenticated: passengerAuth_schema_1.PassengerAuthTable.isDefaultAuthenticated,
                }).from(passenger_schema_1.PassengerTable)
                    .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.email, signInDto.email))
                    .leftJoin(passengerAuth_schema_1.PassengerAuthTable, (0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, passenger_schema_1.PassengerTable.id))
                    .limit(1);
                if (!userResponse || userResponse.length === 0) {
                    throw exceptions_1.ClientSignInEmailNotFoundException;
                }
            }
            const user = userResponse[0];
            if (!user.isDefaultAuthenticated)
                throw exceptions_1.ClientUserAuthenticatedMethodNotAllowedException;
            const pwMatches = await bcrypt.compare(signInDto.password, user.hash);
            delete user.hash;
            if (!pwMatches) {
                throw exceptions_1.ClientSignInPasswordNotMatchException;
            }
            const result = await this._signToken(user.id, user.email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(passenger_schema_1.PassengerTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, user.id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignInUserException;
            }
            return result;
        });
    }
    async signInPassengerWithGoogleAuth(googleSignInDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl)
                throw exceptions_1.ServerExtractGoogleAuthUrlEnvVariableException;
            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignInDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw exceptions_1.ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();
            const userResponse = await tx.select({
                id: passenger_schema_1.PassengerTable.id,
                email: passenger_schema_1.PassengerTable.email,
                googleId: passengerAuth_schema_1.PassengerAuthTable.googleId,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.email, parseDataFromGoogleToken["email"]))
                .leftJoin(passengerAuth_schema_1.PassengerAuthTable, (0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, passenger_schema_1.PassengerTable.id))
                .limit(1);
            if (!userResponse || userResponse.length === 0) {
                throw exceptions_1.ClientSignInEmailNotFoundException;
            }
            const user = userResponse[0];
            if (!user.googleId || user.googleId === null || parseDataFromGoogleToken["sub"] !== user.googleId) {
                throw exceptions_1.ClientUserAuthenticatedMethodNotAllowedException;
            }
            const result = await this._signToken(user.id, user.email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(passenger_schema_1.PassengerTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, user.id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignInUserException;
            }
            return result;
        });
    }
    async signInRidderWithAccountAndPassword(signInDto) {
        return await this.db.transaction(async (tx) => {
            let userResponse = null;
            if (signInDto.userName) {
                userResponse = await tx.select({
                    id: ridder_schema_1.RidderTable.id,
                    email: ridder_schema_1.RidderTable.email,
                    hash: ridder_schema_1.RidderTable.password,
                    isDefaultAuthenticated: ridderAuth_schema_1.RidderAuthTable.isDefaultAuthenticated,
                }).from(ridder_schema_1.RidderTable)
                    .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.userName, signInDto.userName))
                    .leftJoin(ridderAuth_schema_1.RidderAuthTable, (0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, ridder_schema_1.RidderTable.id))
                    .limit(1);
                if (!userResponse || userResponse.length === 0) {
                    throw exceptions_1.ClientSignInUserNameNotFoundException;
                }
            }
            else if (signInDto.email) {
                userResponse = await tx.select({
                    id: ridder_schema_1.RidderTable.id,
                    email: ridder_schema_1.RidderTable.email,
                    hash: ridder_schema_1.RidderTable.password,
                    isDefaultAuthenticated: ridderAuth_schema_1.RidderAuthTable.isDefaultAuthenticated,
                }).from(ridder_schema_1.RidderTable)
                    .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.email, signInDto.email))
                    .leftJoin(ridderAuth_schema_1.RidderAuthTable, (0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, ridder_schema_1.RidderTable.id))
                    .limit(1);
                if (!userResponse || userResponse.length === 0) {
                    throw exceptions_1.ClientSignInEmailNotFoundException;
                }
            }
            const user = userResponse[0];
            if (!user.isDefaultAuthenticated)
                throw exceptions_1.ClientUserAuthenticatedMethodNotAllowedException;
            const pwMatches = await bcrypt.compare(signInDto.password, user.hash);
            delete user.hash;
            if (!pwMatches) {
                throw exceptions_1.ClientSignInPasswordNotMatchException;
            }
            const result = await this._signToken(user.id, user.email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(ridder_schema_1.RidderTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, user.id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignUpUserException;
            }
            return result;
        });
    }
    async signInRidderWithGoogleAuth(googleSignInDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl)
                throw exceptions_1.ServerExtractGoogleAuthUrlEnvVariableException;
            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignInDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw exceptions_1.ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();
            const userResponse = await tx.select({
                id: ridder_schema_1.RidderTable.id,
                email: ridder_schema_1.RidderTable.email,
                googleId: ridderAuth_schema_1.RidderAuthTable.googleId,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.email, parseDataFromGoogleToken["email"]))
                .leftJoin(ridderAuth_schema_1.RidderAuthTable, (0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, ridder_schema_1.RidderTable.id))
                .limit(1);
            if (!userResponse || userResponse.length === 0) {
                throw exceptions_1.ClientSignInEmailNotFoundException;
            }
            const user = userResponse[0];
            if (!user.googleId || user.googleId === null || parseDataFromGoogleToken["sub"] !== user.googleId) {
                throw exceptions_1.ClientUserAuthenticatedMethodNotAllowedException;
            }
            const result = await this._signToken(user.id, user.email);
            if (!result)
                throw exceptions_1.ApiGeneratingBearerTokenException;
            const responseOfUpdatingAccessToken = await tx.update(ridder_schema_1.RidderTable).set({
                accessToken: result.accessToken,
            }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, user.id))
                .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw exceptions_1.ClientSignInUserException;
            }
            return result;
        });
    }
    async _signToken(userId, email) {
        try {
            const payload = {
                sub: userId,
                email: email,
            };
            const secret = this.config.get("JWT_SECRET");
            const token = await this.jwt.signAsync(payload, {
                expiresIn: this.config.get("JWT_TOKEN_EXPIRED_TIME") ?? '60m',
                secret: secret,
            });
            return {
                accessToken: token,
                expiredIn: this.config.get("JWT_TOKEN_EXPIRED_TIME") ?? '60m',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async _tempSignToken(userName, email) {
        try {
            const payload = {
                sub: userName,
                email: email,
            };
            const secret = this.config.get("JWT_TEMP_SECRET");
            const token = await this.jwt.signAsync(payload, {
                expiresIn: this.config.get("JWT_TEMP_TOKEN_EXPIRED_TIME") ?? '5m',
                secret: secret,
            });
            return {
                accessToken: token,
                expiredIn: this.config.get("JWT_TEMP_TOKEN_EXPIRED_TIME") ?? '5m',
            };
        }
        catch (error) {
            throw error;
        }
    }
    _getRandomAuthCode() {
        let randomAuthCode = Math.floor(Math.random() * 1000000).toString();
        while (randomAuthCode.length < 6)
            randomAuthCode = "0" + randomAuthCode;
        return randomAuthCode;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map