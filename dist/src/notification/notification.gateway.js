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
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const notification_service_1 = require("./notification.service");
const jwt = require("jsonwebtoken");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const enums_1 = require("../enums");
let NotificationGateway = class NotificationGateway {
    constructor(notificationService, configService, db) {
        this.notificationService = notificationService;
        this.configService = configService;
        this.db = db;
        this.socketMap = new Map();
    }
    validateToken(token) {
        const secret = this.configService.get("JWT_SECRET");
        if (!secret)
            throw exceptions_1.ServerExtractJwtSecretEnvVariableException;
        try {
            const response = jwt.verify(token, secret);
            return response;
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    async getUserById(userId, token, userRole) {
        let user = undefined;
        if (userRole === "Passenger") {
            user = await this.db.select({
                id: passenger_schema_1.PassengerTable.id,
                userName: passenger_schema_1.PassengerTable.userName,
                email: passenger_schema_1.PassengerTable.email,
                accessToken: passenger_schema_1.PassengerTable.accessToken,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, userId))
                .limit(1);
        }
        else if (userRole === "Ridder") {
            user = await this.db.select({
                id: ridder_schema_1.RidderTable.id,
                userName: ridder_schema_1.RidderTable.userName,
                email: ridder_schema_1.RidderTable.email,
                accessToken: ridder_schema_1.RidderTable.accessToken,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, userId))
                .limit(1);
        }
        if (!user || user.length === 0) {
            throw exceptions_1.ClientInvalidTokenException;
        }
        const userData = user[0];
        if (token !== userData.accessToken) {
            throw exceptions_1.ClientTokenExpiredException;
        }
        delete userData.accessToken;
        return {
            ...userData,
            role: userRole,
        };
    }
    async handleConnection(socket) {
        try {
            const token = socket.handshake.headers.authorization?.split(' ')[1];
            if (!token)
                throw exceptions_1.ClientTokenExpiredException;
            const userRole = socket.handshake.headers.userrole;
            if (!userRole)
                throw exceptions_1.ApiMissingUserRoleInHeaderWhileConnectingToSocketException;
            const payload = this.validateToken(token);
            if (!payload || !payload.sub)
                throw exceptions_1.ServerTranslateBearerTokenToPayloadException;
            const user = await this.getUserById(payload.sub, token, userRole);
            if (!user)
                throw (userRole === "Passenger"
                    ? exceptions_1.ClientPassengerNotFoundException
                    : exceptions_1.ClientRidderNotFoundException);
            console.log({ ...user, socketId: socket.id });
            this.socketMap.set(user.id, {
                ...user,
                socketId: socket.id,
            });
            console.log(`User ${user.id} connected with socket ID ${socket.id}`);
            return {
                status: enums_1.HttpStatusCode.SwitchingProtocols,
                upgrade: socket.handshake.headers.upgrade,
                message: `User ${user.userName} connected with socket ID ${socket.id}`,
            };
        }
        catch (error) {
            console.log(`Connection failed: ${error}`);
            socket.disconnect(true);
            return {
                statu: error.status,
                message: error,
            };
        }
    }
    handleDisconnect(socket) {
        try {
            const [userId, userData] = Array.from(this.socketMap.entries()).find(([, metaPayloads]) => metaPayloads.socketId === socket.id) || [undefined, undefined];
            if (!userId || !userData)
                throw exceptions_1.ServerUserNotFoundInSocketMapException;
            this.socketMap.delete(userId);
            console.log(`User ${userId} disconnected with socket ID ${socket.id}`);
            return {
                status: enums_1.HttpStatusCode.Ok,
                message: `Good bye! User ${userData.userName} disconnected with socket ID ${socket.id}`,
            };
        }
        catch (error) {
            console.log(`Disconnection failed: ${error}`);
            return {
                status: error.status,
                message: error
            };
        }
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(9999),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        config_1.ConfigService, Object])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map