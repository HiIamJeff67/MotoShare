/*
 * we use this file to manage all the enums in our schema, 
 * since if we don't do that, it may cause some circular dependency error
 * ex. purchaseOrder.schema.ts require 'postStatusEnum' and supplyOrder.schema.ts also need one,
 *     if we create 'postStatusEnum' on one of the above schema, then import that one on the other schema,
 *     it will run into the error when you execute npm run start:dev, despite the fact that Neon migration doesn't have this issue
 */

import { pgEnum } from "drizzle-orm/pg-core";

/* ================================= Status Enums ================================= */
export const historyStatusEnum = pgEnum("historyStatus", [
    "FINISHED", 
    "EXPIRED", 
    "CANCEL"
]);

// for PassengerInviteTable and RidderInviteTable
export const inviteStatusEnum = pgEnum("inviteStatus", [
    "ACCEPTED", 
    "REJECTED", 
    "CHECKING", 
    "CANCEL"
]);

// for OrderTable
export const passengerOrderStatusEnum = pgEnum("passengerOrderStatus", ["UNSTARTED", "STARTED", "UNPAID", "FINISHED"]);
export const ridderOrderStatusEnum = pgEnum("ridderOrderStatus", [
    "UNSTARTED", 
    "STARTED", 
    "UNPAID", 
    "FINISHED"
]);

// for both PurchaseOrderTable and SupplyOrderTable
export const postedStatusEnum = pgEnum("postStatus", [
    "POSTED", 
    "EXPIRED", 
    "CANCEL", 
    "RESERVED"
]);
/* ================================= Status Enums ================================= */


/* ================================= Type Enums ================================= */
// currently for PassengerInfoTable and RidderInfoTable
export const userRoleEnum = pgEnum("userRole", [
    "Passenger", 
    "Ridder", 
    "Admin", 
    "Guest", 
]);

// for HistoryTable
export const starRatingEnum = pgEnum("starRating", [
    "0", 
    "1", 
    "2", 
    "3", 
    "4", 
    "5"
]);

// for NotificationTable
export const notificationTypeEnum = pgEnum("notificationType", [
    "PurchaseOrder", 
    "SupplyOrder", 
    "PassengerInvite", 
    "RidderInvite", 
    "Order", 
    "History", 
    "Payment", 
    // "PassengerRegularOrder", 
    // "RidderRegularOrder", 
    "System"
]);

// for PeriodicPurchaseOrderTable & PerioidcSupplyOrderTable
export const daysOfWeekEnum = pgEnum("daysOfWeek", [
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday", 
    "Sunday"
]);
/* ================================= Type Enums ================================= */