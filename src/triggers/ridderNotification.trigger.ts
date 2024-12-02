// the setup of ridder notification trigger in Neon database
// Note that this file is only used for storing the record or structure of ridder notification trigger
// and make sure to add "" if you hope a column name of some attribute name to be lower & upper case sensitive

import "dotenv/config";

const { Client } = require('pg');
const _CONNECTIONSTRING = process.env.DATABASE_URL as string;
const _Client = new Client({
    connectionString: _CONNECTIONSTRING, 
});


async function setUpRidderNotificationTrigger() {
    try {
        // Connect to Postgres
        await _Client.connect();

        // Define the my_trigger_function function to send notifications
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
      
        // Create the my_trigger to call the my_trigger_function after each insert
        await _Client.query(`
            CREATE TRIGGER ridder_notification_trigger
            AFTER INSERT ON "ridderNotification"
            FOR EACH ROW
            EXECUTE FUNCTION ridder_notification_trigger_function();
        `);
      
        console.log('Event ridder trigger setup complete.');
        await _Client.end();
    } catch (e) {
        console.log(e);
    }
}

setUpRidderNotificationTrigger().catch(console.log);