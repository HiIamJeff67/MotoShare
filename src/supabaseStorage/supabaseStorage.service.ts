import * as bcrypt from "bcrypt"
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { AvatorBucketFolderType, MotocyclePhotoBucketFolderType, SupabaseBucketType } from "../types/bucket.type";
import { ClientUploadFileExceedException, ClientUploadFileMimeTypeException, ServerSupabaseUploadFileException, ServerSupabaseUploadFileParaNotFoundException, ServerUnknownException } from "../exceptions";
import { ConfigService } from "@nestjs/config";
import { MAX_AVATOR_FILE_SIZE, MAX_AVATOR_FILE_SIZE_PER_MEGABYTES, MAX_FILE_NAME_LENGTH, MAX_MOTOCYCLE_PHOTO_FILE_SIZE, MAX_MOTOCYCLE_PHOTO_FILE_SIZE_PER_MEGABYTES } from "../constants/file.constant";
import { SUPABASE } from "../supabase/supabase.module";
import { multerToFile } from "../utils";
import { AvatorFileTypes, MotocyclePhotoFileTypes } from "../types";

@Injectable()
export class SupabaseStorageService {
    constructor(
        private config: ConfigService,
        @Inject(SUPABASE) private supabase: SupabaseClient,
    ) {}

    private validateFileMimeType(mimeType: string, validMimeTypes: string[]): boolean {
        for (const option of validMimeTypes) {
            if (mimeType == option) return true;
        }
        return false;
    }

    async uploadAvatorFile(
        infoId: string, // instead of using userId as a part of folder path, we use infoId for more security
        filePath: AvatorBucketFolderType, 
        uploadedFile: Express.Multer.File, 
    ): Promise<string> {
        try {
            if (!filePath || !uploadedFile) throw ServerSupabaseUploadFileParaNotFoundException;
            if (uploadedFile.size > MAX_AVATOR_FILE_SIZE) throw ClientUploadFileExceedException(MAX_AVATOR_FILE_SIZE_PER_MEGABYTES, "MegaBytes");
            if (!this.validateFileMimeType(uploadedFile.mimetype, AvatorFileTypes)) throw ClientUploadFileMimeTypeException(AvatorFileTypes);
    
            const convertedFile = multerToFile(uploadedFile);
    
            // hash the file name to make sure there's no any characters which are not english letters or numbers
            const hashedFileName = (await bcrypt.hash(convertedFile.name, Number(this.config.get("SALT_OR_ROUND_UPLOADED_FILE_NAME") ?? 2)));
            const targetFolderPath = `${filePath}/${infoId}/`;
            const targetFilePath = `${targetFolderPath}${hashedFileName.replace('.', '').replaceAll('/', '_').substring(0, MAX_FILE_NAME_LENGTH)}`;
    
            // 1. check if there's any file in the target folder
            const { data: existingFiles, error: listError } = await this.supabase.storage
                .from("AvatorBucket")
                .list(targetFolderPath);
    
            if (listError) {
                throw ServerSupabaseUploadFileException(listError.message);
            }
    
            // 2. if there's exist any file, delete the previous file, since we are updating the users avator to the new one
            if (existingFiles && existingFiles.length > 0) {
                const filesToDelete = existingFiles.map(file => `${targetFolderPath}${file.name}`);
                const { error: deleteError } = await this.supabase.storage
                    .from("AvatorBucket")
                    .remove(filesToDelete);
    
                if (deleteError) {
                    throw ServerSupabaseUploadFileException(deleteError.message);
                }
            }
    
            // 3. upload logic
            const { error: uploadError } = await this.supabase.storage
                .from("AvatorBucket")
                .upload(targetFilePath, convertedFile);
    
            if (uploadError) {
                throw ServerSupabaseUploadFileException(uploadError.message);
            }
    
            // 4. get public url
            const { data: publicUrlData } = this.supabase.storage
                .from("AvatorBucket")
                .getPublicUrl(targetFilePath);
    
            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw ServerSupabaseUploadFileException("Cannot get public url");
            }
            
            return publicUrlData.publicUrl;
        } catch (error) {
            throw error;
        }
    }

    // (overload the above function with different file path)
    async uploadMotocyclePhotoFile(
        infoId: string, // instead of using userId as a part of folder path, we use infoId for more security
        filePath: MotocyclePhotoBucketFolderType, 
        uploadedFile: Express.Multer.File, 
    ): Promise<string> {
        try {
            if (!filePath || !uploadedFile) throw ServerSupabaseUploadFileParaNotFoundException;
            if (uploadedFile.size > MAX_MOTOCYCLE_PHOTO_FILE_SIZE) throw ClientUploadFileExceedException(MAX_MOTOCYCLE_PHOTO_FILE_SIZE_PER_MEGABYTES, "MegaBytes");
            if (!this.validateFileMimeType(uploadedFile.mimetype, MotocyclePhotoFileTypes)) throw ClientUploadFileMimeTypeException(MotocyclePhotoFileTypes);
    
            const convertedFile = multerToFile(uploadedFile);
    
            // hash the file name to make sure there's no any characters which are not english letters or numbers
            const hashedFileName = (await bcrypt.hash(convertedFile.name, Number(this.config.get("SALT_OR_ROUND_UPLOADED_FILE_NAME") ?? 2)));
            const targetFolderPath = `${filePath}/${infoId}/`;
            const targetFilePath = `${targetFolderPath}${hashedFileName.replace('.', '').replaceAll('/', '_').substring(0, MAX_FILE_NAME_LENGTH)}`;
    
            // 1. check if there's any file in the target folder
            const { data: existingFiles, error: listError } = await this.supabase.storage
                .from("MotocyclePhotoBucket")
                .list(targetFolderPath);

            if (listError) {
                throw ServerSupabaseUploadFileException(listError.message);
            }
    
            // 2. if there's exist any file, delete the previous file, since we are updating the users avator to the new one
            if (existingFiles && existingFiles.length > 0) {
                const filesToDelete = existingFiles.map(file => `${targetFolderPath}${file.name}`);
                const { error: deleteError } = await this.supabase.storage
                    .from("MotocyclePhotoBucket")
                    .remove(filesToDelete);
    
                if (deleteError) {
                    throw ServerSupabaseUploadFileException(deleteError.message);
                }
            }
    
            // 3. upload logic
            const { error: uploadError } = await this.supabase.storage
                .from("MotocyclePhotoBucket")
                .upload(targetFilePath, convertedFile);
    
            if (uploadError) {
                throw ServerSupabaseUploadFileException(uploadError.message);
            }
    
            // 4. get public url
            const { data: publicUrlData } = this.supabase.storage
                .from("MotocyclePhotoBucket")
                .getPublicUrl(targetFilePath);
    
            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw ServerSupabaseUploadFileException("Cannot get public url");
            }
            
            return publicUrlData.publicUrl;
        } catch (error) {
            throw error;
        }
    }
}