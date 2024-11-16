"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleModule = exports.DRIZZLE = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = require("./schema/schema");
exports.DRIZZLE = Symbol("drizzle-connection");
let DrizzleModule = class DrizzleModule {
};
exports.DrizzleModule = DrizzleModule;
exports.DrizzleModule = DrizzleModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.DRIZZLE,
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const databaseURL = configService.get("DATABASE_URL");
                    const pool = new pg_1.Pool({
                        connectionString: databaseURL,
                        ssl: true,
                    });
                    return (0, node_postgres_1.drizzle)(pool, { schema });
                },
            },
        ],
        exports: [exports.DRIZZLE],
    })
], DrizzleModule);
//# sourceMappingURL=drizzle.module.js.map