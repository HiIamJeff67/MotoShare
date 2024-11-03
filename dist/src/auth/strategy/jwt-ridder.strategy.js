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
exports.JwtRidderStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const drizzle_module_1 = require("../../drizzle/drizzle.module");
const ridder_schema_1 = require("../../drizzle/schema/ridder.schema");
const drizzle_orm_1 = require("drizzle-orm");
let JwtRidderStrategy = class JwtRidderStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-ridder') {
    constructor(config, db) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET"),
        });
        this.config = config;
        this.db = db;
    }
    async validate(payload) {
        const user = await this.db.select({
            id: ridder_schema_1.RidderTable.id,
            userName: ridder_schema_1.RidderTable.userName,
            email: ridder_schema_1.RidderTable.userName,
        }).from(ridder_schema_1.RidderTable)
            .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, payload.sub))
            .limit(1);
        return user;
    }
};
exports.JwtRidderStrategy = JwtRidderStrategy;
exports.JwtRidderStrategy = JwtRidderStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], JwtRidderStrategy);
//# sourceMappingURL=jwt-ridder.strategy.js.map