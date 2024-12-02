import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "./schema/schema";
import { ServerNeonEnvVarNotFoundException } from '../exceptions';

export const DRIZZLE = Symbol("drizzle-connection");

@Module({
    providers: [
        {
            provide: DRIZZLE,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const databaseURL = configService.get<string>("DATABASE_URL") as string;   // environment variable from .env
                if (!databaseURL) throw ServerNeonEnvVarNotFoundException;
                const pool = new Pool({
                    connectionString: databaseURL, 
                    // keepAlive: true, 
                    // idleTimeoutMillis: configService.get<number>("IDLE_TIMEOUT_MILLS") as number * 1000, // unit: second
                    // keepAliveInitialDelayMillis: configService.get<number>("KEEP_ALIVE_HEART_BEAT_FREQUENCY") as number * 1000, // unit: second
                    ssl: true,
                });
                return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DrizzleModule {}
