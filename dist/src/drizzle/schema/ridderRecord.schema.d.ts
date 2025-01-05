export declare const RidderRecordTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "ridderRecord";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "ridderRecord";
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
            tableName: "ridderRecord";
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
            tableName: "ridderRecord";
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
                tableName: "ridderRecord";
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
export declare const RidderRecordRelation: import("drizzle-orm").Relations<"ridderRecord", {
    user: import("drizzle-orm").One<"ridder", false>;
}>;
