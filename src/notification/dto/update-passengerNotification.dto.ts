import { IsBooleanString, IsNotEmpty } from "class-validator";

export class UpdatePassengerNotificationDto {
  @IsNotEmpty()
  @IsBooleanString()
  isRead: "true"
}
