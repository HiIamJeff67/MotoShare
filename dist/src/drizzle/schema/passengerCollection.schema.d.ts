export declare const PassengerCollectionTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "passengerCollection";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "passengerCollection";
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
            tableName: "passengerCollection";
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
export declare const PassengerCollectionsToOrders: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "passengerCollectionsToOrders";
    schema: undefined;
    columns: {
        collectionId: import("drizzle-orm/pg-core").PgColumn<{
            name: "collectionId";
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
export declare const PassengerCollectionRelation: import("drizzle-orm").Relations<"passengerCollection", {
    user: import("drizzle-orm").One<"passenger", true>;
    collectionsToOrders: import("drizzle-orm").Many<"passengerCollectionsToOrders">;
}>;
export declare const PassengerCollectionsToOrdersRelation: import("drizzle-orm").Relations<"passengerCollectionsToOrders", {
    collection: import("drizzle-orm").One<"passengerCollection", true>;
    order: import("drizzle-orm").One<"supplyOrder", true>;
}>;
