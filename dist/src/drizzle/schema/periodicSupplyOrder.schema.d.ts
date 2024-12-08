export declare const PeriodicSupplyOrderTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "periodicSupplyOrder";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "periodicSupplyOrder";
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
        creatorId: import("drizzle-orm/pg-core").PgColumn<{
            name: "creatorId";
            tableName: "periodicSupplyOrder";
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
        initPrice: import("drizzle-orm/pg-core").PgColumn<{
            name: "initPrice";
            tableName: "periodicSupplyOrder";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        startCord: import("drizzle-orm/pg-core").PgColumn<{
            name: "startCord";
            tableName: "periodicSupplyOrder";
            dataType: "json";
            columnType: "PgGeometryObject";
            data: {
                x: number;
                y: number;
            };
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
        endCord: import("drizzle-orm/pg-core").PgColumn<{
            name: "endCord";
            tableName: "periodicSupplyOrder";
            dataType: "json";
            columnType: "PgGeometryObject";
            data: {
                x: number;
                y: number;
            };
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
        startAddress: import("drizzle-orm/pg-core").PgColumn<{
            name: "startAddress";
            tableName: "periodicSupplyOrder";
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
        endAddress: import("drizzle-orm/pg-core").PgColumn<{
            name: "endAddress";
            tableName: "periodicSupplyOrder";
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
        startAfter: import("drizzle-orm/pg-core").PgColumn<{
            name: "startAfter";
            tableName: "periodicSupplyOrder";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
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
        endedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "endedAt";
            tableName: "periodicSupplyOrder";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
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
        scheduledDay: import("drizzle-orm/pg-core").PgColumn<{
            name: "scheduledDay";
            tableName: "periodicSupplyOrder";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        tolerableRDV: import("drizzle-orm/pg-core").PgColumn<{
            name: "tolerableRDV";
            tableName: "periodicSupplyOrder";
            dataType: "number";
            columnType: "PgDoublePrecision";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        autoAccept: import("drizzle-orm/pg-core").PgColumn<{
            name: "autoAccept";
            tableName: "periodicSupplyOrder";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "createdAt";
            tableName: "periodicSupplyOrder";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            generated: undefined;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updatedAt";
            tableName: "periodicSupplyOrder";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
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
export declare const PeriodicSupplyOrderRelation: import("drizzle-orm").Relations<"periodicSupplyOrder", {
    creator: import("drizzle-orm").One<"ridder", true>;
}>;
