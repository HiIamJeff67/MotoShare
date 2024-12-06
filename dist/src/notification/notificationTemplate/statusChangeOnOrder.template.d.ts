import { NotificationTemplateInterface } from "../../interfaces";
import { OrderStatusType } from "../../types";
export declare const NotificationTemplateOfChangingOrderStatus: (editorName: string, receiverId: string, orderId: string, prevStatus: OrderStatusType, curStatus: OrderStatusType) => NotificationTemplateInterface;
