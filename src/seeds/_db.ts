// we should protected the db variables, althrough we haven't leak any sensitive data, 
// it is quite dangous to export db variables directly, 
// since other modules or services or files can potentially use them...

import * as schema from "../drizzle/schema/schema";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import 'dotenv/config';

export class _DatabaseInstace {
    private pool = new Pool({
        connectionString: process.env.DATABASE_URL, 
        ssl: true, 
    });
    
    protected schema = schema;
    protected _db = drizzle(this.pool, { schema }) as NodePgDatabase<typeof schema>;
};
