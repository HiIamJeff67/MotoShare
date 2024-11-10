
export type PostedStatusType = "POSTED" | "EXPIRED" | "CANCEL";
export const PostedStatusTypes = ["POSTED", "EXPIRED", "CANCEL"];

/* =========== For PassengerInviteTable and RidderInviteTable =========== */
export type InviteStatusType = "ACCEPTED" | "REJECTED" | "CHECKING" | "CANCEL";
export const InviteStatusTypes = ["ACCEPTED", "REJECTED", "CHECKING", "CANCEL"];

export type InviterStatusType = "CHECKING" | "CANCEL";
export const InviterStatusTypes = ["CHECKING", "CANCEL"];

export type ReceiverStatusType = "CHECKING" | "ACCEPTED" | "REJECTED";
export const ReceiverStatusTypes = ["CHECKING", "ACCEPTED", "REJECTED"];
/* =========== For PassengerInviteTable and RidderInviteTable =========== */

export type OrderStatusType = "UNSTARTED" | "STARTED";
export const OrderStatusTypes = ["UNSTARTED", "STARTED"];

export type HistoryStatusType = "FINISHED" | "EXPIRED" | "CANCEL";
export const HistoryStatusTypes = ["FINISHED", "EXPIRED", "CANCEL"];
