import { Module } from "@nestjs/common";
import { SupabaseStorageService } from "./supabaseStorage.service";
import { SupabaseModule } from "../supabase/supabase.module";
import { DrizzleModule } from "../drizzle/drizzle.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    providers: [SupabaseStorageService],
    imports: [SupabaseModule, DrizzleModule, ConfigModule],
    exports: [SupabaseStorageService],
})
export class SupabaseStorageModule {}