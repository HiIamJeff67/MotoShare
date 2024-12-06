export declare const RidderPreferences: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "ridderPreferences";
    schema: undefined;
    columns: {
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "userId";
            tableName: "ridderPreferences";
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
        preferenceUserId: import("drizzle-orm/pg-core").PgColumn<{
            name: "preferenceUserId";
            tableName: "ridderPreferences";
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
export declare const RidderPreferencesRelation: import("drizzle-orm").Relations<"ridderPreferences", {
    user: import("drizzle-orm").One<"ridder", true>;
    preferenceUser: import("drizzle-orm").One<"passenger", true>;
}>;
