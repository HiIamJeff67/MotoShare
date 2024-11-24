import { _DatabaseInstace } from "./_db";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { MAX_SEED_QUANTITY, MIN_SEED_QUNANTITY } from "../constants";
import { sql } from "drizzle-orm";
import { SeedingPassengerType } from "../interfaces";
import { ClientCreatePassengerAuthException, ClientCreatePassengerInfoException, ClientSignUpUserException } from "../exceptions";

export class PassengerSeedingOperator extends _DatabaseInstace {
    private __getRandomAuthCode(): string {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }

    public _seedPassengers = async function(
        quantity: number, 
    ): Promise<SeedingPassengerType[] | undefined> {
        try {
            if (quantity > MAX_SEED_QUANTITY || quantity < MIN_SEED_QUNANTITY) {
                throw Error(`Seeding with ${quantity} data violate the maximum of ${MAX_SEED_QUANTITY} or the minimum of ${MIN_SEED_QUNANTITY}`);
            }
    
            const passengers: SeedingPassengerType[] = await Promise.all(
                Array(quantity).fill({ id: "", userName: "" }).map(async () => {
                    return await this._db.transaction(async (tx) => {
                        const hash = await bcrypt.hash(faker.internet.password(), Number(process.env.SALT_OR_ROUND));
    
                        const responseOfCreatingPassenger = await tx.insert(this.schema.PassengerTable).values({
                            email: faker.internet.email(), 
                            userName: faker.person.firstName() + (Math.floor(Math.random() * 1000)).toString(),
                            password: hash, 
                            accessToken: "FAKE_SEEDING_USER", 
                        }).returning({
                            id: this.schema.PassengerTable.id, 
                            userName: this.schema.PassengerTable.userName, 
                        });
                        if (!responseOfCreatingPassenger || responseOfCreatingPassenger.length === 0) {
                            throw ClientSignUpUserException;
                        }
                        
                        const responseOfCreatingPassengerInfo = await tx.insert(this.schema.PassengerInfoTable).values({
                            userId: responseOfCreatingPassenger[0].id, 
                        }).returning();
                        if (!responseOfCreatingPassengerInfo || responseOfCreatingPassengerInfo.length === 0) {
                            throw ClientCreatePassengerInfoException;
                        }

                        const responseOfCreatingPassengerAuth = await tx.insert(this.schema.PassengerAuthTable).value({
                            userId: responseOfCreatingPassenger[0].id, 
                            authCode: this.__getRandomAuthCode(), 
                            authCodeExpiredAt: new Date((new Date()).getTime() + Number(process.env.AUTH_CODE_EXPIRED_IN) * 60000), 
                        }).returning();
                        if (!responseOfCreatingPassengerAuth || responseOfCreatingPassengerAuth.length === 0) {
                            throw ClientCreatePassengerAuthException;
                        }
    
                        return responseOfCreatingPassenger[0];
                    });
                })
            );
    
            return passengers;
    
        } catch (error) {
            console.log("Error occurred when seeding passengers:", error);
            return undefined;
        }
    }

    public _getRandomPassengers = async function(quantity: number): Promise<{ id: string, userName: string }[] | undefined> {
        try {
            if (quantity > MAX_SEED_QUANTITY || quantity < MIN_SEED_QUNANTITY) {
                throw Error(`Seeding with ${quantity} data violate the maximum of ${MAX_SEED_QUANTITY} or the minimum of ${MIN_SEED_QUNANTITY}`);
            }

            const response = await this._db.select({
                id: this.schema.PassengerTable.id, 
                userName: this.schema.PassengerTable.userName, 
            }).from(this.schema.PassengerTable)
              .orderBy(sql`RANDOM()`)
              .limit(quantity);
            if (!response || response.length === 0) {
                throw Error();
            }

            return response;

        } catch (error) {
            console.log("Error occurred when getting some random passengers:", error);
            return undefined;
        }
    }
};

