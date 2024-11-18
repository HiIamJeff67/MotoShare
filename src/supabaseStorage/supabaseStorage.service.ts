import * as bcrypt from "bcrypt"
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { FilePathType, SupabaseBucketType } from "../types/bucket.type";
import { ServerSupabaseUploadFileException, ServerSupabaseUploadFileParaNotFoundException, ServerUnknownException } from "../exceptions";
import { ConfigService } from "@nestjs/config";
import { MAX_FILE_NAME_LENGTH } from "../constants/file.constant";
import { SUPABASE } from "../supabase/supabase.module";
import { multerToFile } from "../utils";

@Injectable()
export class SupabaseStorageService {
    constructor(
        private config: ConfigService,
        @Inject(SUPABASE) private supabase: SupabaseClient,
    ) {}

    async uploadFile(
        infoId: string, // instead of using userId as a part of folder path, we use infoId for more security
        bucketName: SupabaseBucketType, 
        filePath: FilePathType, 
        uploadedFile: Express.Multer.File
    ): Promise<string> {
        try {
            if (!filePath || !bucketName || !uploadedFile) throw ServerSupabaseUploadFileParaNotFoundException;
    
            const convertedFile = multerToFile(uploadedFile);
    
            // hash the file name to make sure there's no any characters which are not english letters or numbers
            const hashedFileName = await bcrypt.hash(convertedFile.name, Number(this.config.get("SALT_OR_ROUND_UPLOADED_FILE_NAME") ?? 2));
            const targetFolderPath = `passengerAvators/${infoId}/`;
            const targetFilePath = `${targetFolderPath}${hashedFileName.replace('.', '').substring(0, MAX_FILE_NAME_LENGTH)}`;
    
            // 1. check if there's any file in the target folder
            const { data: existingFiles, error: listError } = await this.supabase.storage
                .from(bucketName)
                .list(targetFolderPath);
    
            if (listError) {
                throw ServerSupabaseUploadFileException;
            }
    
            // 2. if there's exist any file, delete the previous file, since we are updating the users avator to the new one
            if (existingFiles && existingFiles.length > 0) {
                const filesToDelete = existingFiles.map(file => `${targetFolderPath}${file.name}`);
                const { error: deleteError } = await this.supabase.storage
                    .from(bucketName)
                    .remove(filesToDelete);
    
                if (deleteError) {
                    throw ServerSupabaseUploadFileException;
                }
            }
    
            // 3. upload logic
            const { error: uploadError } = await this.supabase.storage
                .from(bucketName)
                .upload(targetFilePath, convertedFile);
    
            if (uploadError) {
                throw ServerSupabaseUploadFileException;
            }
    
            // 4. get public url
            const { data: publicUrlData } = this.supabase.storage
                .from(bucketName)
                .getPublicUrl(targetFilePath);
    
            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw ServerSupabaseUploadFileException;
            }
            
            return publicUrlData.publicUrl;
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                error = ServerUnknownException;
            }
    
            throw error;
        }
    }
}