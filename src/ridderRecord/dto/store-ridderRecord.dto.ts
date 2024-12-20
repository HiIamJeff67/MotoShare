import { IsObject, IsNotEmpty } from "class-validator";

export class StoreRidderRecordDto {
    @IsNotEmpty()
    @IsObject()
    searchRecord: Record<string, any>;

    constructor(value: Record<string, any>) {
        this.searchRecord = value;
    }
}
