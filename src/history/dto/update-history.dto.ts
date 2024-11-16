import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { StarRatingType, StarRatingTypes } from "../../types/starRating.type";
import { MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH } from "../../constants/context.constant";

export class UpdateHistoryDto {
    @IsOptional()
    @IsIn(StarRatingTypes, { message: "The value of starRating must be either 0, 1, 2, 3, 4, or 5" })
    starRating?: StarRatingType

    @IsOptional()
    @MinLength(MIN_COMMENT_LENGTH)
    @MaxLength(MAX_COMMENT_LENGTH)
    @IsString()
    comment?: string
}
