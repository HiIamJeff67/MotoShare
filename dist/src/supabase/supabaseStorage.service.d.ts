import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseBucketType } from "../types/bucket.type";
export declare class SupabaseStorageService {
    private supabase;
    constructor(supabase: SupabaseClient);
    uploadFile(bucketName: SupabaseBucketType, filePath: string, file: File): Promise<void>;
}
