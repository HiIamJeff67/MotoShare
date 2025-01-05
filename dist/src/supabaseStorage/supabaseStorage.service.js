"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const exceptions_1 = require("../exceptions");
const config_1 = require("@nestjs/config");
const file_constant_1 = require("../constants/file.constant");
const supabase_module_1 = require("../supabase/supabase.module");
const utils_1 = require("../utils");
const types_1 = require("../types");
let SupabaseStorageService = class SupabaseStorageService {
    constructor(config, supabase) {
        this.config = config;
        this.supabase = supabase;
    }
    validateFileMimeType(mimeType, validMimeTypes) {
        for (const option of validMimeTypes) {
            if (mimeType == option)
                return true;
        }
        return false;
    }
    async uploadAvatorFile(infoId, filePath, uploadedFile) {
        try {
            if (!filePath || !uploadedFile)
                throw exceptions_1.ServerSupabaseUploadFileParaNotFoundException;
            if (uploadedFile.size > file_constant_1.MAX_AVATOR_FILE_SIZE)
                throw (0, exceptions_1.ClientUploadFileExceedException)(file_constant_1.MAX_AVATOR_FILE_SIZE_PER_MEGABYTES, "MegaBytes");
            if (!this.validateFileMimeType(uploadedFile.mimetype, types_1.AvatorFileTypes))
                throw (0, exceptions_1.ClientUploadFileMimeTypeException)(types_1.AvatorFileTypes);
            const convertedFile = (0, utils_1.multerToFile)(uploadedFile);
            const hashedFileName = (await bcrypt.hash(convertedFile.name, Number(this.config.get("SALT_OR_ROUND_UPLOADED_FILE_NAME") ?? 2)));
            const targetFolderPath = `${filePath}/${infoId}/`;
            const targetFilePath = `${targetFolderPath}${hashedFileName.replace('.', '').replaceAll('/', '_').substring(0, file_constant_1.MAX_FILE_NAME_LENGTH)}`;
            const { data: existingFiles, error: listError } = await this.supabase.storage
                .from("AvatorBucket")
                .list(targetFolderPath);
            if (listError) {
                throw (0, exceptions_1.ServerSupabaseUploadFileException)(listError.message);
            }
            if (existingFiles && existingFiles.length > 0) {
                const filesToDelete = existingFiles.map(file => `${targetFolderPath}${file.name}`);
                const { error: deleteError } = await this.supabase.storage
                    .from("AvatorBucket")
                    .remove(filesToDelete);
                if (deleteError) {
                    throw (0, exceptions_1.ServerSupabaseUploadFileException)(deleteError.message);
                }
            }
            const { error: uploadError } = await this.supabase.storage
                .from("AvatorBucket")
                .upload(targetFilePath, convertedFile);
            if (uploadError) {
                throw (0, exceptions_1.ServerSupabaseUploadFileException)(uploadError.message);
            }
            const { data: publicUrlData } = this.supabase.storage
                .from("AvatorBucket")
                .getPublicUrl(targetFilePath);
            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw (0, exceptions_1.ServerSupabaseUploadFileException)("Cannot get public url");
            }
            return publicUrlData.publicUrl;
        }
        catch (error) {
            throw error;
        }
    }
    async uploadMotocyclePhotoFile(infoId, filePath, uploadedFile) {
        try {
            if (!filePath || !uploadedFile)
                throw exceptions_1.ServerSupabaseUploadFileParaNotFoundException;
            if (uploadedFile.size > file_constant_1.MAX_MOTOCYCLE_PHOTO_FILE_SIZE)
                throw (0, exceptions_1.ClientUploadFileExceedException)(file_constant_1.MAX_MOTOCYCLE_PHOTO_FILE_SIZE_PER_MEGABYTES, "MegaBytes");
            if (!this.validateFileMimeType(uploadedFile.mimetype, types_1.MotocyclePhotoFileTypes))
                throw (0, exceptions_1.ClientUploadFileMimeTypeException)(types_1.MotocyclePhotoFileTypes);
            const convertedFile = (0, utils_1.multerToFile)(uploadedFile);
            const hashedFileName = (await bcrypt.hash(convertedFile.name, Number(this.config.get("SALT_OR_ROUND_UPLOADED_FILE_NAME") ?? 2)));
            const targetFolderPath = `${filePath}/${infoId}/`;
            const targetFilePath = `${targetFolderPath}${hashedFileName.replace('.', '').replaceAll('/', '_').substring(0, file_constant_1.MAX_FILE_NAME_LENGTH)}`;
            const { data: existingFiles, error: listError } = await this.supabase.storage
                .from("MotocyclePhotoBucket")
                .list(targetFolderPath);
            if (listError) {
                throw (0, exceptions_1.ServerSupabaseUploadFileException)(listError.message);
            }
            if (existingFiles && existingFiles.length > 0) {
                const filesToDelete = existingFiles.map(file => `${targetFolderPath}${file.name}`);
                const { error: deleteError } = await this.supabase.storage
                    .from("MotocyclePhotoBucket")
                    .remove(filesToDelete);
                if (deleteError) {
                    throw (0, exceptions_1.ServerSupabaseUploadFileException)(deleteError.message);
                }
            }
            const { error: uploadError } = await this.supabase.storage
                .from("MotocyclePhotoBucket")
                .upload(targetFilePath, convertedFile);
            if (uploadError) {
                throw (0, exceptions_1.ServerSupabaseUploadFileException)(uploadError.message);
            }
            const { data: publicUrlData } = this.supabase.storage
                .from("MotocyclePhotoBucket")
                .getPublicUrl(targetFilePath);
            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw (0, exceptions_1.ServerSupabaseUploadFileException)("Cannot get public url");
            }
            return publicUrlData.publicUrl;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.SupabaseStorageService = SupabaseStorageService;
exports.SupabaseStorageService = SupabaseStorageService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(supabase_module_1.SUPABASE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabase_js_1.SupabaseClient])
], SupabaseStorageService);
//# sourceMappingURL=supabaseStorage.service.js.map