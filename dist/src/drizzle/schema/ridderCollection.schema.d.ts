export declare const RidderCollectionTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "ridderCollection";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "ridderCollection";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "userId";
            tableName: "ridderCollection";
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
export declare const RidderCollectionsToOrders: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "ridderCollectionsToOrders";
    schema: undefined;
    columns: {
        collectionId: import("drizzle-orm/pg-core").PgColumn<{
            name: "collectionId";
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
export declare const RidderCollectionRelation: import("drizzle-orm").Relations<"ridderCollection", {
    user: import("drizzle-orm").One<"ridder", true>;
    collectionsToOrders: import("drizzle-orm").Many<"ridderCollectionsToOrders">;
}>;
export declare const RidderCollectionsToOrdersRelation: import("drizzle-orm").Relations<"ridderCollectionsToOrders", {
    collection: import("drizzle-orm").One<"ridderCollection", true>;
    order: import("drizzle-orm").One<"purchaseOrder", true>;
}>;
