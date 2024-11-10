"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderInviteService = void 0;
const common_1 = require("@nestjs/common");
let RidderInviteService = class RidderInviteService {
    create(createRidderInviteDto) {
        return 'This action adds a new ridderInvite';
    }
    findAll() {
        return `This action returns all ridderInvite`;
    }
    findOne(id) {
        return `This action returns a #${id} ridderInvite`;
    }
    update(id, updateRidderInviteDto) {
        return `This action updates a #${id} ridderInvite`;
    }
    remove(id) {
        return `This action removes a #${id} ridderInvite`;
    }
};
exports.RidderInviteService = RidderInviteService;
exports.RidderInviteService = RidderInviteService = __decorate([
    (0, common_1.Injectable)()
], RidderInviteService);
//# sourceMappingURL=ridderInvite.service.js.map