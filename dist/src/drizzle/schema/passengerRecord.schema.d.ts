export declare const PassengerRecordTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "passengerRecord";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "passengerRecord";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "userId";
            tableName: "passengerRecord";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        searchRecords: import("drizzle-orm/pg-core").PgColumn<{
            name: "searchRecords";
            tableName: "passengerRecord";
            dataType: "array";
            columnType: "PgArray";
            data: unknown[];
            driverParam: string | unknown[];
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: import("drizzle-orm").Column<{
                name: "";
                tableName: "passengerRecord";
                dataType: "json";
                columnType: "PgJsonb";
                data: unknown;
                driverParam: unknown;
                notNull: false;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                generated: undefined;
            }, object, object>;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const PassengerRecordRelation: import("drizzle-orm").Relations<"passengerRecord", {
    user: import("drizzle-orm").One<"passenger", false>;
}>;
