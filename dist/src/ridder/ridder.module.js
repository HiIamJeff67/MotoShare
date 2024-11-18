"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderModule = void 0;
const common_1 = require("@nestjs/common");
const ridder_service_1 = require("./ridder.service");
const ridder_controller_1 = require("./ridder.controller");
const drizzle_module_1 = require("../../src/drizzle/drizzle.module");
const supabaseStorage_module_1 = require("../supabaseStorage/supabaseStorage.module");
let RidderModule = class RidderModule {
};
exports.RidderModule = RidderModule;
exports.RidderModule = RidderModule = __decorate([
    (0, common_1.Module)({
        controllers: [ridder_controller_1.RidderController],
        providers: [ridder_service_1.RidderService],
        imports: [drizzle_module_1.DrizzleModule, supabaseStorage_module_1.SupabaseStorageModule],
    })
], RidderModule);
//# sourceMappingURL=ridder.module.js.map