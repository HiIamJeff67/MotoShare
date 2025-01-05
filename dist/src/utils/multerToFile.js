"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerToFile = multerToFile;
function multerToFile(multerFile) {
    return new File([multerFile.buffer], multerFile.originalname, {
        type: multerFile.mimetype,
        lastModified: Date.now(),
    });
}
//# sourceMappingURL=multerToFile.js.map