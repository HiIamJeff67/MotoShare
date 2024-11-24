import { _DatabaseInstace } from "./_db";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { MAX_SEED_QUANTITY, MIN_SEED_QUNANTITY } from "../constants";
import { sql } from "drizzle-orm";
import { SeedingRidderType } from "../interfaces";
import { ClientCreateRidderAuthException, ClientCreateRidderInfoException, ClientSignUpUserException } from "../exceptions";

export class RidderSeedingOperator extends(_DatabaseInstace) {
    private __getRandomAuthCode(): string {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }

    public _seedRidders = async function(
        quantity: number, 
    ): Promise<SeedingRidderType[] | undefined> {
        try {
            if (quantity > MAX_SEED_QUANTITY || quantity < MIN_SEED_QUNANTITY) {
                throw Error(`Seeding with ${quantity} data violate the maximum of ${MAX_SEED_QUANTITY} or the minimum of ${MIN_SEED_QUNANTITY}`);
            }
    
            const ridders: SeedingRidderType[] = await Promise.all(
                Array(quantity).fill({ id: "", userName: "" }).map(async () => {
                    return await this._db.transaction(async (tx) => {
                        const hash = await bcrypt.hash(faker.internet.password(), Number(process.env.SALT_OR_ROUND));
    
                        const responseOfCreatingRidder = await tx.insert(this.schema.RidderTable).values({
                            email: faker.internet.email(), 
                            userName: faker.person.firstName() + (Math.floor(Math.random() * 1000)).toString(),
                            password: hash, 
                            accessToken: "FAKE_SEEDING_USER", 
                        }).returning({
                            id: this.schema.RidderTable.id, 
                            userName: this.schema.RidderTable.userName, 
                        });
                        if (!responseOfCreatingRidder || responseOfCreatingRidder.length === 0) {
                            throw ClientSignUpUserException;
                        }
                        
                        const responseOfCreatingRidderInfo = await tx.insert(this.schema.RidderInfoTable).values({
                            userId: responseOfCreatingRidder[0].id, 
                        }).returning();
                        if (!responseOfCreatingRidderInfo || responseOfCreatingRidderInfo.length === 0) {
                            throw ClientCreateRidderInfoException;
                        }

                        const responseOfCreatingRidderAuth = await tx.insert(this.schema.RidderAuthTable).value({
                            userId: responseOfCreatingRidder[0].id, 
                            authCode: this.__getRandomAuthCode(), 
                            authCodeExpiredAt: new Date((new Date()).getTime() + Number(process.env.AUTH_CODE_EXPIRED_IN) * 60000), 
                        }).returning();
                        if (!responseOfCreatingRidderAuth || responseOfCreatingRidderAuth.length === 0) {
                            throw ClientCreateRidderAuthException;
                        }
    
                        return responseOfCreatingRidder[0];
                    });
                })
            );
    
            return ridders;
    
        } catch (error) {
            console.log("Error occurred when seeding ridders:", error);
            return undefined;
        }
    }

    public _getRandomRidders = async function(quantity: number): Promise<{ id: string, userName: string }[] | undefined> {
        try {
            if (quantity > MAX_SEED_QUANTITY || quantity < MIN_SEED_QUNANTITY) {
                throw Error(`Seeding with ${quantity} data violate the maximum of ${MAX_SEED_QUANTITY} or the minimum of ${MIN_SEED_QUNANTITY}`);
            }

            const response = await this._db.select({
                id: this.schema.RidderTable.id, 
                userName: this.schema.RidderTable.userName, 
            }).from(this.schema.RidderTable)
              .orderBy(sql`RANDOM()`)
              .limit(quantity);
            if (!response || response.length === 0) {
                throw Error();
            }

            return response;

        } catch (error) {
            console.log("Error occurred when getting some random ridders:", error);
            return undefined;
        }
    }
}
