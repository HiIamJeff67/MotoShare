"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageModule = void 0;
const common_1 = require("@nestjs/common");
const supabaseStorage_service_1 = require("./supabaseStorage.service");
const supabase_module_1 = require("../supabase/supabase.module");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const config_1 = require("@nestjs/config");
let SupabaseStorageModule = class SupabaseStorageModule {
};
exports.SupabaseStorageModule = SupabaseStorageModule;
exports.SupabaseStorageModule = SupabaseStorageModule = __decorate([
    (0, common_1.Module)({
        providers: [supabaseStorage_service_1.SupabaseStorageService],
        imports: [supabase_module_1.SupabaseModule, drizzle_module_1.DrizzleModule, config_1.ConfigModule],
        exports: [supabaseStorage_service_1.SupabaseStorageService],
    })
], SupabaseStorageModule);
//# sourceMappingURL=supabaseStorage.module.js.map