export declare const RidderCollectionsToOrders: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "ridderCollectionsToOrders";
    schema: undefined;
    columns: {
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "userId";
            tableName: "ridderCollectionsToOrders";
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
            tableName: "ridderCollectionsToOrders";
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
export declare const RidderCollectionsToOrdersRelation: import("drizzle-orm").Relations<"ridderCollectionsToOrders", {
    collection: import("drizzle-orm").One<"ridder", true>;
    order: import("drizzle-orm").One<"purchaseOrder", true>;
}>;
