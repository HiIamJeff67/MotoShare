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
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
let AuthService = class AuthService {
    constructor(config, db, jwt) {
        this.config = config;
        this.db = db;
        this.jwt = jwt;
    }
    async signUpPassengerWithEmailAndPassword(signUpDto) {
        const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));
        const response = await this.db.insert(passenger_schema_1.PassengerTable).values({
            userName: signUpDto.userName,
            email: signUpDto.email,
            password: hash,
        }).returning({
            id: passenger_schema_1.PassengerTable.id,
            email: passenger_schema_1.PassengerTable.email,
        });
        if (!response) {
            throw new common_1.ConflictException(`Duplicate userName or email detected`);
        }
        const responseOfCreatingInfo = this.createPassengerInfoByUserId(response[0].id);
        if (!responseOfCreatingInfo) {
            throw new Error('Cannot create the info for current passenger');
        }
        return this.signToken(response[0].id, response[0].email);
    }
    async createPassengerInfoByUserId(userId) {
        return await this.db.insert(passengerInfo_schema_1.PassengerInfoTable).values({
            userId: userId
        });
    }
    async signUpRidderWithEmailAndPassword(signUpDto) {
        const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));
        const response = await this.db.insert(ridder_schema_1.RidderTable).values({
            userName: signUpDto.userName,
            email: signUpDto.email,
            password: hash,
        }).returning({
            id: ridder_schema_1.RidderTable.id,
            email: ridder_schema_1.RidderTable.email,
        });
        if (!response) {
            throw new common_1.ConflictException(`Duplicate userName or email detected`);
        }
        const responseOfCreatingInfo = this.createRidderInfoByUserId(response[0].id);
        if (!responseOfCreatingInfo) {
            throw new Error('Cannot create the info for current passenger');
        }
        return this.signToken(response[0].id, response[0].email);
    }
    async createRidderInfoByUserId(userId) {
        return await this.db.insert(ridderInfo_schema_1.RidderInfoTable).values({
            userId: userId
        });
    }
    async signInPassengerEmailAndPassword(signInDto) {
        let userResponse = null;
        if (signInDto.userName) {
            userResponse = await this.db.select({
                id: passenger_schema_1.PassengerTable.id,
                email: passenger_schema_1.PassengerTable.email,
                hash: passenger_schema_1.PassengerTable.password,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, signInDto.userName))
                .limit(1);
        }
        else if (signInDto.email) {
            userResponse = await this.db.select({
                id: passenger_schema_1.PassengerTable.id,
                email: passenger_schema_1.PassengerTable.email,
                hash: passenger_schema_1.PassengerTable.password,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.email, signInDto.email))
                .limit(1);
        }
        if (!userResponse || userResponse.length === 0) {
            throw new common_1.ForbiddenException('Credential incorrect');
        }
        const user = userResponse[0];
        const pwMatches = await bcrypt.compare(signInDto.password, user.hash);
        delete user.hash;
        if (!pwMatches) {
            throw new common_1.ForbiddenException('Credential incorrect');
        }
        return this.signToken(user.id, user.email);
    }
    async signInRidderByEmailAndPassword(signInDto) {
        let userResponse = null;
        if (signInDto.userName) {
            userResponse = await this.db.select({
                id: ridder_schema_1.RidderTable.id,
                email: ridder_schema_1.RidderTable.email,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.userName, signInDto.userName))
                .limit(1);
        }
        else if (signInDto.email) {
            userResponse = await this.db.select({
                id: ridder_schema_1.RidderTable.id,
                email: ridder_schema_1.RidderTable.email,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.email, signInDto.email))
                .limit(1);
        }
        if (!userResponse || userResponse.length === 0) {
            throw new common_1.ForbiddenException('Credential incorrect');
        }
        const user = userResponse[0];
        const pwMatches = await bcrypt.compare(signInDto.password, user.hash);
        if (!pwMatches) {
            throw new common_1.ForbiddenException('Credential incorrect');
        }
        return this.signToken(user.id, user.email);
    }
    async signToken(userId, email) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map