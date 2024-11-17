import { Inject, Injectable } from "@nestjs/common";
import { SUPABASE } from "./supabase.module";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseBucketType } from "../types/bucket.type";

@Injectable()
export class SupabaseStorageService {
    constructor(@Inject(SUPABASE) private supabase: SupabaseClient) {}

    async uploadFile(bucketName: SupabaseBucketType, filePath: string, file: File) {
        const { data, error } = await this.supabase.storage.from(bucketName).upload(filePath, file);
        if (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
        console.log('File uploaded successfully:', data);
    }
}