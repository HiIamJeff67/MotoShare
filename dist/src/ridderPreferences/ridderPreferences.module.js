"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderPreferencesModule = void 0;
const common_1 = require("@nestjs/common");
const ridderPreferences_service_1 = require("./ridderPreferences.service");
const ridderPreferences_controller_1 = require("./ridderPreferences.controller");
const drizzle_module_1 = require("../drizzle/drizzle.module");
let RidderPreferencesModule = class RidderPreferencesModule {
};
exports.RidderPreferencesModule = RidderPreferencesModule;
exports.RidderPreferencesModule = RidderPreferencesModule = __decorate([
    (0, common_1.Module)({
        controllers: [ridderPreferences_controller_1.RidderPreferencesController],
        providers: [ridderPreferences_service_1.RidderPreferencesService],
        imports: [drizzle_module_1.DrizzleModule],
    })
], RidderPreferencesModule);
//# sourceMappingURL=ridderPreferences.module.js.map