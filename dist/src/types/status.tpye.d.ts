export type PostedStatusType = "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
export declare const PostedStatusTypes: PostedStatusType[];
export type InviteStatusType = "ACCEPTED" | "REJECTED" | "CHECKING" | "CANCEL";
export declare const InviteStatusTypes: InviteStatusType[];
export type InviterStatusType = "CHECKING" | "CANCEL" | "ACCEPTED" | "REJECTED";
export declare const InviterStatusTypes: InviterStatusType[];
export type ReceiverStatusType = "CHECKING" | "CANCEL" | "ACCEPTED" | "REJECTED";
export declare const ReceiverStatusTypes: ReceiverStatusType[];
export type OrderStatusType = "UNSTARTED" | "STARTED" | "UNPAID" | "FINISHED";
export declare const OrderStatusTypes: never[];
export type HistoryStatusType = "FINISHED" | "EXPIRED" | "CANCEL";
export declare const HistoryStatusTypes: never[];
