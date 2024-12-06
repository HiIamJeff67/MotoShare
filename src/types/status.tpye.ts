export type PostedStatusType = "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
export const PostedStatusTypes: PostedStatusType[] = ["POSTED"];   // not allowing "EXPIRED" and "RESERVED" to be specified

/* =========== For PassengerInviteTable and RidderInviteTable =========== */
export type InviteStatusType = "ACCEPTED" | "REJECTED" | "CHECKING" | "CANCEL";
export const InviteStatusTypes: InviteStatusType[] = ["ACCEPTED", "REJECTED", "CHECKING", "CANCEL"];

export type InviterStatusType = "CHECKING" | "CANCEL" | "ACCEPTED" | "REJECTED";
export const InviterStatusTypes: InviterStatusType[] = ["CHECKING", "CANCEL"];   // not allowing "ACCEPTED" or "REJECTED" to be specified

export type ReceiverStatusType = "CHECKING" | "CANCEL" | "ACCEPTED" | "REJECTED";
export const ReceiverStatusTypes: ReceiverStatusType[] = ["CHECKING", "ACCEPTED", "REJECTED"];    // not allowing "CANCEL" to be specified
/* =========== For PassengerInviteTable and RidderInviteTable =========== */

export type OrderStatusType = "UNSTARTED" | "STARTED" | "UNPAID" | "FINISHED"
export const OrderStatusTypes = [];  // not allowing user to update this manually, we'll cover the status step by step using API route

export type HistoryStatusType = "FINISHED" | "EXPIRED" | "CANCEL";
export const HistoryStatusTypes = [];   // not allowing user to update this manually, we'll cover the status step by step using API route
