import { SupabaseClient } from "@supabase/supabase-js";
import { AvatorBucketFolderType, MotocyclePhotoBucketFolderType } from "../types/bucket.type";
import { ConfigService } from "@nestjs/config";
export declare class SupabaseStorageService {
    private config;
    private supabase;
    constructor(config: ConfigService, supabase: SupabaseClient);
    private validateFileMimeType;
    uploadAvatorFile(infoId: string, filePath: AvatorBucketFolderType, uploadedFile: Express.Multer.File): Promise<string>;
    uploadMotocyclePhotoFile(infoId: string, filePath: MotocyclePhotoBucketFolderType, uploadedFile: Express.Multer.File): Promise<string>;
}
