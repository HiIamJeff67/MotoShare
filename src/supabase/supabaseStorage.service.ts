// import * as bcrypt from "bcrypt"
// import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
// import { SUPABASE } from "./supabase.module";
// import { SupabaseClient } from "@supabase/supabase-js";
// import { FilePathType, SupabaseBucketType } from "../types/bucket.type";
// import { multerToFile } from "../utils";
// import { ServerSupabaseUploadFileException, ServerSupabaseUploadFileParaNotFoundException, ServerUnknownException } from "../exceptions";
// import { ConfigService } from "@nestjs/config";
// import { MAX_FILE_NAME_LENGTH } from "../constants/file.constant";

// @Injectable()
// export class SupabaseStorageService {
//     constructor(
//         private config: ConfigService,
//         @Inject(SUPABASE) private supabase: SupabaseClient
//     ) {}

//     async uploadFile(bucketName: SupabaseBucketType, filePath: FilePathType, uploadedFile: Express.Multer.File): Promise<string> {
//         try {
//             if (!filePath || !bucketName || !uploadedFile) throw ServerSupabaseUploadFileParaNotFoundException;
//             const convertedFile = multerToFile(uploadedFile);
//             const hashedFileName = await bcrypt.hash(convertedFile.name, Number(this.config.get("SALT_OR_ROUND_UPLOADED_FILE_NAME") ?? 2));
//             const targetFilePath = `passengerAvators/${hashedFileName.replace('.', '').substring(0, MAX_FILE_NAME_LENGTH)}`;
//             await this.supabase.storage.from("AvatorBucket").upload(targetFilePath, convertedFile);
//             const url = (await this.supabase.storage.from("AvatorBucket").getPublicUrl(filePath)).data.publicUrl;
//             if (!url) throw ServerSupabaseUploadFileException;

//             return url;
//         } catch (error) {
//             if (!(error instanceof InternalServerErrorException)) {
//                 error = ServerUnknownException;
//             }
            
//             throw error;
//         }
//     }
// }