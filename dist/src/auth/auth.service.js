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
                authCode: this._getRandomAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).returning();
            if (!responseOfCreatingPassengerAuth || responseOfCreatingPassengerAuth.length === 0) {
                throw exceptions_1.ClientCreatePassengerAuthException;
            }
            return result;
        });
    }
    async signUpRidderWithEmailAndPassword(signUpDto) {
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
                authCode: this._getRandomAuthCode(),
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000),
            }).returning();
            if (!responseOfCreatingRidderAuth || responseOfCreatingRidderAuth.length === 0) {
                throw exceptions_1.ClientCreatePassengerAuthException;
            }
            return result;
        });
    }
    async signInPassengerEmailAndPassword(signInDto) {
        return await this.db.transaction(async (tx) => {
            let userResponse = null;
            if (signInDto.userName) {
                userResponse = await tx.select({
                    id: passenger_schema_1.PassengerTable.id,
                    email: passenger_schema_1.PassengerTable.email,
                    hash: passenger_schema_1.PassengerTable.password,
                }).from(passenger_schema_1.PassengerTable)
                    .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, signInDto.userName))
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
                }).from(passenger_schema_1.PassengerTable)
                    .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.email, signInDto.email))
                    .limit(1);
                if (!userResponse || userResponse.length === 0) {
                    throw exceptions_1.ClientSignInEmailNotFoundException;
                }
            }
            const user = userResponse[0];
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
    async signInRidderByEmailAndPassword(signInDto) {
        return await this.db.transaction(async (tx) => {
            let userResponse = null;
            if (signInDto.userName) {
                userResponse = await tx.select({
                    id: ridder_schema_1.RidderTable.id,
                    email: ridder_schema_1.RidderTable.email,
                    hash: ridder_schema_1.RidderTable.password,
                }).from(ridder_schema_1.RidderTable)
                    .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.userName, signInDto.userName))
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
                }).from(ridder_schema_1.RidderTable)
                    .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.email, signInDto.email))
                    .limit(1);
                if (!userResponse || userResponse.length === 0) {
                    throw exceptions_1.ClientSignInEmailNotFoundException;
                }
            }
            const user = userResponse[0];
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
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map