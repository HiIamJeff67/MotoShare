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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidePassengerInviteDto = exports.UpdatePassengerInviteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_passengerInvite_dto_1 = require("./create-passengerInvite.dto");
const class_validator_1 = require("class-validator");
const status_tpye_1 = require("../../types/status.tpye");
class UpdatePassengerInviteDto extends (0, mapped_types_1.PartialType)(create_passengerInvite_dto_1.CreatePassengerInviteDto) {
}
exports.UpdatePassengerInviteDto = UpdatePassengerInviteDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(status_tpye_1.InviterStatusTypes, { message: "The status of PassengerInvite must be either CHECKING or CANCEL" }),
    __metadata("design:type", String)
], UpdatePassengerInviteDto.prototype, "status", void 0);
class DecidePassengerInviteDto {
}
exports.DecidePassengerInviteDto = DecidePassengerInviteDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(status_tpye_1.ReceiverStatusTypes, { message: "The status of PassengerInvite must be either ACCEPTED, REJECTED, or CHECKING" }),
    __metadata("design:type", String)
], DecidePassengerInviteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => (o.status === "REJECT")),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecidePassengerInviteDto.prototype, "rejectReason", void 0);
//# sourceMappingURL=update-passengerInvite.dto.js.map