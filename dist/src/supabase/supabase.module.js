"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseModule = exports.SUPABASE = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const exceptions_1 = require("../exceptions");
const supabase_js_1 = require("@supabase/supabase-js");
exports.SUPABASE = Symbol('supabase-client');
let SupabaseModule = class SupabaseModule {
};
exports.SupabaseModule = SupabaseModule;
exports.SupabaseModule = SupabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.SUPABASE,
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const supabaseUrl = configService.get('SUPABASE_URL');
                    const supabaseAPIKey = configService.get('SUPABASE_API_KEY');
                    if (!supabaseUrl || !supabaseAPIKey)
                        throw exceptions_1.ServerSupabaseEnvVarNotFoundException;
                    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseAPIKey);
                },
            },
        ],
        exports: [exports.SUPABASE],
    })
], SupabaseModule);
//# sourceMappingURL=supabase.module.js.map