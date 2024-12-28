"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const { Client } = require('pg');
const _CONNECTIONSTRING = process.env.DATABASE_URL;
const _Client = new Client({
    connectionString: _CONNECTIONSTRING,
});
async function setUpRidderNotificationTrigger() {
    try {
        await _Client.connect();
        await _Client.query(`
            CREATE OR REPLACE FUNCTION ridder_notification_trigger_function() RETURNS trigger AS $$
            BEGIN
                PERFORM pg_notify(
                    'ridder_notifications', 
                    json_build_object(
                        'id', NEW."id",
                        'userId', NEW."userId",
                        'title', NEW."title",
                        'desciption', NEW."description",
                        'notificationType', NEW."notificationType",
                        'linkId', NEW."linkId",
                        'isRead', NEW."isRead",
                        'createdAt', NEW."createdAt"
                    )::text
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
        await _Client.query(`
            CREATE TRIGGER ridder_notification_trigger
            AFTER INSERT ON "ridderNotification"
            FOR EACH ROW
            EXECUTE FUNCTION ridder_notification_trigger_function();
        `);
        console.log('Event ridder notification trigger setup complete.');
        await _Client.end();
    }
    catch (e) {
        console.log(e);
    }
}
setUpRidderNotificationTrigger().catch(console.log);
//# sourceMappingURL=ridderNotification.trigger.js.map