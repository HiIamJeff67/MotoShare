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
const jwt = require("jsonwebtoken");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const schema_1 = require("../drizzle/schema/schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
let NotificationGateway = class NotificationGateway {
    constructor(configService, db) {
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
            throw exceptions_1.ClientTokenExpiredException;
        }
    }
    async getUserById(userId, token, userRole) {
        const user = (userRole === "Passenger")
            ? await this.db.select({
                id: schema_1.PassengerTable.id,
                userName: schema_1.PassengerTable.userName,
                email: schema_1.PassengerTable.email,
                accessToken: schema_1.PassengerTable.accessToken,
            }).from(schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(schema_1.PassengerTable.id, userId))
                .limit(1)
            : await this.db.select({
                id: schema_1.RidderTable.id,
                userName: schema_1.RidderTable.userName,
                email: schema_1.RidderTable.email,
                accessToken: schema_1.RidderTable.accessToken,
            }).from(schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(schema_1.RidderTable.id, userId))
                .limit(1);
        if (!user || user.length === 0) {
            throw exceptions_1.ClientInvalidTokenException;
        }
        if (user[0].accessToken !== token) {
            throw exceptions_1.ClientTokenExpiredException;
        }
        return {
            ...user[0],
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
            if (this.socketMap.has(user.id)) {
                const existingUser = this.socketMap.get(user.id);
                if (existingUser) {
                    this.socketMap.delete(user.id);
                    existingUser.socket.disconnect(true);
                }
            }
            this.socketMap.set(user.id, {
                ...user,
                socket: socket,
            });
            socket.join(`${socket.id}'s notification`);
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
            const [userId, userData] = Array.from(this.socketMap.entries()).find(([, metaPayloads]) => metaPayloads.socket.id === socket.id) || [undefined, undefined];
            if (!userId || !userData)
                throw exceptions_1.ServerUserNotFoundInSocketMapException;
            socket.disconnect(true);
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
    forceDisconnect(socket) {
        if (socket) {
            socket.disconnect(true);
        }
    }
    notifyPassenger(userId, notification) {
        const socketUser = this.socketMap.get(userId);
        if (socketUser && socketUser.role === "Passenger") {
            console.log(`Pushing to room : ${socketUser.socket.id}'s notification`);
            this.server.to(`${socketUser.socket.id}'s notification`).emit(`notification`, notification);
        }
    }
    notifyRidder(userId, notification) {
        const socketUser = this.socketMap.get(userId);
        if (socketUser && socketUser.role === "Ridder") {
            console.log(`Pushing to room : ${socketUser.socket.id}'s notification`);
            this.server.to(`${socketUser.socket.id}'s notification`).emit(`notification`, notification);
        }
    }
    onTest(data) {
        const event = 'test';
        this.server.emit('test', { event, data });
        return { event, data };
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('forceDisconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "forceDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('test'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], NotificationGateway.prototype, "onTest", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'notifications' }),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map