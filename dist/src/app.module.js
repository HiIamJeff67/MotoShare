"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const drizzle_module_1 = require("./drizzle/drizzle.module");
const passenger_module_1 = require("./passenger/passenger.module");
const config_1 = require("@nestjs/config");
const passengerInfo_module_1 = require("./passengerInfo/passengerInfo.module");
const purchaseOrder_module_1 = require("./purchaseOrder/purchaseOrder.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            drizzle_module_1.DrizzleModule,
            passenger_module_1.PassengerModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            passengerInfo_module_1.PassengerInfoModule,
            purchaseOrder_module_1.PurchaseOrderModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map