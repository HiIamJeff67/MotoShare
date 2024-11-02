export declare const PassengerTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "passenger";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "passenger";
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
        userName: import("drizzle-orm/pg-core").PgColumn<{
            name: "userName";
            tableName: "passenger";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        email: import("drizzle-orm/pg-core").PgColumn<{
            name: "email";
            tableName: "passenger";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        password: import("drizzle-orm/pg-core").PgColumn<{
            name: "password";
            tableName: "passenger";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const PassengerRelation: import("drizzle-orm").Relations<"passenger", {
    info: import("drizzle-orm").One<"passengerInfo", false>;
    collection: import("drizzle-orm").Many<"passengerCollectionsToOrders">;
    purchaseOrders: import("drizzle-orm").Many<"purchaseOrder">;
    orders: import("drizzle-orm").Many<"order">;
    historyOrders: import("drizzle-orm").Many<"history">;
}>;
