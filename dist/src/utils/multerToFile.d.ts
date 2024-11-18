type CustomFile = File & {
    webkitRelativePath?: string;
};
export declare function multerToFile(multerFile: Express.Multer.File): CustomFile;
export {};
