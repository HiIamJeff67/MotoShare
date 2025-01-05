"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._DatabaseInstace = void 0;
const schema = require("../drizzle/schema/schema");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
require("dotenv/config");
class _DatabaseInstace {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
        this.schema = schema;
        this._db = (0, node_postgres_1.drizzle)(this.pool, { schema });
    }
}
exports._DatabaseInstace = _DatabaseInstace;
;
//# sourceMappingURL=_db.js.map