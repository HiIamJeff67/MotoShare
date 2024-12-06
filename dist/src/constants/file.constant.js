"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_MOTOCYCLE_PHOTO_FILE_SIZE = exports.MAX_MOTOCYCLE_PHOTO_FILE_SIZE_PER_MEGABYTES = exports.MAX_AVATOR_FILE_SIZE = exports.MAX_AVATOR_FILE_SIZE_PER_MEGABYTES = exports.MAX_FILE_NAME_LENGTH = void 0;
const size_constant_1 = require("./size.constant");
exports.MAX_FILE_NAME_LENGTH = 10;
exports.MAX_AVATOR_FILE_SIZE_PER_MEGABYTES = 5;
exports.MAX_AVATOR_FILE_SIZE = exports.MAX_AVATOR_FILE_SIZE_PER_MEGABYTES * size_constant_1.FileInterceptorMegaBytes;
exports.MAX_MOTOCYCLE_PHOTO_FILE_SIZE_PER_MEGABYTES = 10;
exports.MAX_MOTOCYCLE_PHOTO_FILE_SIZE = exports.MAX_MOTOCYCLE_PHOTO_FILE_SIZE_PER_MEGABYTES * size_constant_1.FileInterceptorMegaBytes;
//# sourceMappingURL=file.constant.js.map