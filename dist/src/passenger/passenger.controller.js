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
exports.PassengerController = void 0;
const common_1 = require("@nestjs/common");
const passenger_service_1 = require("./passenger.service");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const update_info_dto_1 = require("./dto/update-info.dto");
const jwt_passenger_guard_1 = require("../../src/auth/guard/jwt-passenger.guard");
const jwt_1 = require("@nestjs/jwt");
const update_passenger_dto_1 = require("./dto/update-passenger.dto");
let PassengerController = class PassengerController {
    constructor(passengerService) {
        this.passengerService = passengerService;
    }
    getMe(request, response) {
        try {
            if (!request || !request.user) {
                throw new jwt_1.TokenExpiredError("access token has expired, please try to login again", new Date());
            }
            const user = request.user;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(user);
        }
        catch (error) {
            response.status(error instanceof jwt_1.TokenExpiredError
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520).send({
                message: error.message,
            });
        }
    }
    async getPassengerInfo(request, response) {
        try {
            if (!request || !request.user) {
                throw new jwt_1.TokenExpiredError("access token has expired, please try to login again", new Date());
            }
            const user = request.user;
            const res = await this.passengerService.getPassengerWithInfoByUserId(user.id);
            if (!res)
                throw new common_1.NotFoundException("Cannot find the passenger with given id");
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error instanceof jwt_1.TokenExpiredError
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async getPassengerCollection(request, response) {
        try {
            if (!request.user || !request.user) {
                throw new jwt_1.TokenExpiredError("access token has expired, please try to login again", new Date());
            }
            const user = request.user;
            const res = await this.passengerService.getPassengerWithCollectionByUserId(user.id);
            if (!res)
                throw new common_1.NotFoundException("Cannot find the passenger with given id");
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error instanceof jwt_1.TokenExpiredError
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async searchPassengersByUserName(userName, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerService.searchPassengersByUserName(userName, +limit, +offset);
            if (!res || res.length == 0) {
                throw new common_1.NotFoundException("Cannot find any passengers");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error instanceof common_1.NotFoundException
                ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520).send({
                message: error.message,
            });
        }
    }
    async getPaginationPassengers(limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerService.getPaginationPassengers(+limit, +offset);
            if (!res || res.length == 0) {
                throw new common_1.NotFoundException("Cannot find any passengers");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error instanceof common_1.NotFoundException
                ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520).send({
                message: error.message,
            });
        }
    }
    async updateMe(request, updatePassengerDto, response) {
        try {
            if (!request || !request.user) {
                throw new jwt_1.TokenExpiredError("access token has expired, please try to login again", new Date());
            }
            const user = request.user;
            const res = await this.passengerService.updatePassengerById(user.id, updatePassengerDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find the passenger with given id to update");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status(error instanceof jwt_1.TokenExpiredError
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : (error instanceof common_1.ConflictException
                        ? HttpStatusCode_enum_1.HttpStatusCode.Conflict
                        : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520))).send({
                message: error.message,
            });
        }
    }
    async updateMyInfo(request, updatePassengerInfoDto, response) {
        try {
            if (!request || !request.user) {
                throw new jwt_1.TokenExpiredError("access token has expired, please try to login again", new Date());
            }
            const user = request.user;
            const res = await this.passengerService.updatePassengerInfoByUserId(user.id, updatePassengerInfoDto);
            if (!res) {
                throw new common_1.NotFoundException("Cannot find the passenger with given id to update");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({});
        }
        catch (error) {
            response.status(error instanceof jwt_1.TokenExpiredError
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async deleteMe(request, response) {
        try {
            if (!request || !request.user) {
                throw new jwt_1.TokenExpiredError("access token has expired, please try to login again", new Date());
            }
            const user = request.user;
            const res = await this.passengerService.deletePassengerById(user.id);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find the passenger with given id to update");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status(error instanceof jwt_1.TokenExpiredError
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    getTest() {
        console.log("test");
    }
    async getAllPassengers(response) {
        try {
            const res = await this.passengerService.getAllPassengers();
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                alert: "This route is currently only for debugging",
                ...res
            });
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find any passengers",
            });
        }
    }
};
exports.PassengerController = PassengerController;
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMe'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyInfo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getPassengerInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyCollection'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getPassengerCollection", null);
__decorate([
    (0, common_1.Get)('searchPassengersByUserName'),
    __param(0, (0, common_1.Query)('userName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "searchPassengersByUserName", null);
__decorate([
    (0, common_1.Get)('getPaginationPassengers'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getPaginationPassengers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('updateMe'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_passenger_dto_1.UpdatePassengerDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "updateMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('updateMyInfo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_info_dto_1.UpdatePassengerInfoDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "updateMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('deleteMe'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "deleteMe", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "getTest", null);
__decorate([
    (0, common_1.Get)('getAllPassengers'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getAllPassengers", null);
exports.PassengerController = PassengerController = __decorate([
    (0, common_1.Controller)('passenger'),
    __metadata("design:paramtypes", [passenger_service_1.PassengerService])
], PassengerController);
//# sourceMappingURL=passenger.controller.js.map