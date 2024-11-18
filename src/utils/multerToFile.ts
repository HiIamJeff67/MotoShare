type CustomFile = File & {
    webkitRelativePath?: string;
};
  
export function multerToFile(multerFile: Express.Multer.File): CustomFile {
    return new File([multerFile.buffer], multerFile.originalname, {
        type: multerFile.mimetype,
        lastModified: Date.now(),
    }) as CustomFile;
}