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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateAndCommentHistoryDto = void 0;
const class_validator_1 = require("class-validator");
const starRating_type_1 = require("../../types/starRating.type");
const context_constant_1 = require("../../constants/context.constant");
class RateAndCommentHistoryDto {
}
exports.RateAndCommentHistoryDto = RateAndCommentHistoryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(starRating_type_1.StarRatingTypes, { message: "The value of starRating must be either 1, 2, 3, 4, or 5" }),
    __metadata("design:type", String)
], RateAndCommentHistoryDto.prototype, "starRating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(context_constant_1.MIN_COMMENT_LENGTH),
    (0, class_validator_1.MaxLength)(context_constant_1.MAX_COMMENT_LENGTH),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RateAndCommentHistoryDto.prototype, "comment", void 0);
//# sourceMappingURL=update-history.dto.js.map