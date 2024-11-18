import { SupabaseClient } from "@supabase/supabase-js";
import { FilePathType, SupabaseBucketType } from "../types/bucket.type";
import { ConfigService } from "@nestjs/config";
export declare class SupabaseStorageService {
    private config;
    private supabase;
    constructor(config: ConfigService, supabase: SupabaseClient);
    uploadFile(infoId: string, bucketName: SupabaseBucketType, filePath: FilePathType, uploadedFile: Express.Multer.File): Promise<string>;
}
