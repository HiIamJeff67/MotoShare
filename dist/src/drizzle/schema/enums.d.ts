export declare const historyStatusEnum: import("drizzle-orm/pg-core").PgEnum<["FINISHED", "EXPIRED", "CANCEL"]>;
export declare const inviteStatusEnum: import("drizzle-orm/pg-core").PgEnum<["ACCEPTED", "REJECTED", "CHECKING", "CANCEL"]>;
export declare const passengerOrderStatusEnum: import("drizzle-orm/pg-core").PgEnum<["UNSTARTED", "STARTED", "UNPAID", "FINISHED"]>;
export declare const ridderOrderStatusEnum: import("drizzle-orm/pg-core").PgEnum<["UNSTARTED", "STARTED", "UNPAID", "FINISHED"]>;
export declare const postedStatusEnum: import("drizzle-orm/pg-core").PgEnum<["POSTED", "EXPIRED", "CANCEL", "RESERVED"]>;
export declare const starRatingEnum: import("drizzle-orm/pg-core").PgEnum<["0", "1", "2", "3", "4", "5"]>;
export declare const notificationTypeEnum: import("drizzle-orm/pg-core").PgEnum<["PurchaseOrder", "SupplyOrder", "PassengerInvite", "RidderInvite", "Order", "History", "Payment", "System"]>;
