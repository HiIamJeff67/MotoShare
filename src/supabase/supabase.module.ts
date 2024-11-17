import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ServerSupabaseEnvVarNotFoundException } from "../exceptions";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE = Symbol('supabase-client');

@Module({
    providers: [
        {
            provide: SUPABASE,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const supabaseUrl = configService.get<string>('SUPABASE_URL');
                const supabaseAPIKey = configService.get<string>('SUPABASE_API_KEY');
                if (!supabaseUrl || !supabaseAPIKey) throw ServerSupabaseEnvVarNotFoundException;
                return createClient(supabaseUrl, supabaseAPIKey) as SupabaseClient;
            },
        },
    ],
    exports: [SUPABASE],
})
export class SupabaseModule {}