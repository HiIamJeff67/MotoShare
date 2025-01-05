import * as schema from "../drizzle/schema/schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import 'dotenv/config';
export declare class _DatabaseInstace {
    private pool;
    protected schema: typeof schema;
    protected _db: NodePgDatabase<typeof schema>;
}
