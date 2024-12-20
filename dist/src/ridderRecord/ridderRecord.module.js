"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderRecordModule = void 0;
const common_1 = require("@nestjs/common");
const ridderRecord_service_1 = require("./ridderRecord.service");
const ridderRecord_controller_1 = require("./ridderRecord.controller");
const drizzle_module_1 = require("../drizzle/drizzle.module");
let RidderRecordModule = class RidderRecordModule {
};
exports.RidderRecordModule = RidderRecordModule;
exports.RidderRecordModule = RidderRecordModule = __decorate([
    (0, common_1.Module)({
        controllers: [ridderRecord_controller_1.RidderRecordController],
        providers: [ridderRecord_service_1.RidderRecordService],
        imports: [drizzle_module_1.DrizzleModule],
    })
], RidderRecordModule);
//# sourceMappingURL=ridderRecord.module.js.map