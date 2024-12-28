"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const { Client } = require('pg');
const _CONNECTIONSTRING = process.env.DATABASE_URL;
const _Client = new Client({
    connectionString: _CONNECTIONSTRING,
});
async function setUpPassengerSearchRecordTrigger() {
    try {
        await _Client.connect();
        await _Client.query(`
            CREATE OR REPLACE FUNCTION passenger_search_record_trigger_function() RETURNS trigger AS $$
            BEGIN
                UPDATE "passengerRecord"
                SET "searchRecords" = array_prepend(
                    jsonb_build_object(
                        'description', NEW."description",
                        'startAddress', NEW."startAddress",
                        'endAddress', NEW."endAddress",
                        'startCord', ST_AsGeoJSON(ST_Transform(NEW."startCord", 4326))::jsonb,
                        'endCord', ST_AsGeoJSON(ST_Transform(NEW."endCord", 4326))::jsonb,
                        'isUrgent', NEW."isUrgent",
                        'createdAt', NEW."createdAt"
                    ), 
                    "searchRecords"
                )
                WHERE "userId" = NEW."creatorId";
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
        await _Client.query(`
            CREATE TRIGGER passenger_search_record_trigger
            AFTER INSERT ON "purchaseOrder"
            FOR EACH ROW
            EXECUTE FUNCTION passenger_search_record_trigger_function();
        `);
        console.log('Event passenger search record trigger setup complete');
        await _Client.end();
    }
    catch (e) {
        console.log(e);
    }
}
setUpPassengerSearchRecordTrigger().catch(console.log);
//# sourceMappingURL=passengerSearchRecord.trigger.js.map