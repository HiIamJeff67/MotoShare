export declare const PassengerPreferences: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "passengerPreferences";
    schema: undefined;
    columns: {
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "userId";
            tableName: "passengerPreferences";
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
            tableName: "passengerPreferences";
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
export declare const PassengerPreferencesRelation: import("drizzle-orm").Relations<"passengerPreferences", {
    user: import("drizzle-orm").One<"passenger", true>;
    preferenceUser: import("drizzle-orm").One<"ridder", true>;
}>;
