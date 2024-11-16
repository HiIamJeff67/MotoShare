"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderInviteModule = void 0;
const common_1 = require("@nestjs/common");
const ridderInvite_service_1 = require("./ridderInvite.service");
const ridderInvite_controller_1 = require("./ridderInvite.controller");
const drizzle_module_1 = require("../drizzle/drizzle.module");
let RidderInviteModule = class RidderInviteModule {
};
exports.RidderInviteModule = RidderInviteModule;
exports.RidderInviteModule = RidderInviteModule = __decorate([
    (0, common_1.Module)({
        controllers: [ridderInvite_controller_1.RidderInviteController],
        providers: [ridderInvite_service_1.RidderInviteService],
        imports: [drizzle_module_1.DrizzleModule],
    })
], RidderInviteModule);
//# sourceMappingURL=ridderInvite.module.js.map