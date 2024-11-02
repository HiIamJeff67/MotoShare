export declare const PassengerCollectionsToOrders: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "passengerCollectionsToOrders";
    schema: undefined;
    columns: {
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "userId";
            tableName: "passengerCollectionsToOrders";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        orderId: import("drizzle-orm/pg-core").PgColumn<{
            name: "orderId";
            tableName: "passengerCollectionsToOrders";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const PassengerCollectionsToOrdersRelation: import("drizzle-orm").Relations<"passengerCollectionsToOrders", {
    collection: import("drizzle-orm").One<"passenger", true>;
    order: import("drizzle-orm").One<"supplyOrder", true>;
}>;
