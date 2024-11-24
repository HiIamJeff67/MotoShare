import { faker } from "@faker-js/faker";
import { SeedingPassengerInviteType, SeedingPassengerType, SeedingSupplyOrderType } from "../interfaces";
import { _DatabaseInstace } from "./_db";
import { MAX_BRIEF_DESCRIPTION_LENGTH, MAX_SEED_QUANTITY, MAX_SUGGEST_PRICE, MIN_BRIEF_DESCRIPTION_LENGTH, MIN_SEED_QUNANTITY, MIN_SUGGEST_PRICE } from "../constants";
import { sql } from "drizzle-orm";
import { ClientCreatePassengerInviteException, ClientInviteNotFoundException, ClientPassengerNotFoundException } from "../exceptions";

export class PassengerInviteSeedingOperator extends(_DatabaseInstace) {
    public _seedPassengerInvites = async function(
        passengers: SeedingPassengerType[], 
        supplyOrders: SeedingSupplyOrderType[], 
        isStartAfterSoon?: boolean, 
        options?: { startAfterDays?: number, startAfterYears?: number, endedAtDays?: number, endedAtYears?: number },
    ): Promise<SeedingPassengerInviteType[] | undefined> {
        try {
            if (passengers.length !== supplyOrders.length || passengers.length === 0) {
                throw Error(`Seeding passengerInvites with empty passenger and supplyOrder`);
            }
            if (options && options.startAfterDays && options.endedAtDays && options.startAfterDays >= options.endedAtDays
                || options?.startAfterYears && options.endedAtYears && options.startAfterYears >= options.endedAtYears) {
                    throw Error(`StartAfterDays or StartAfterYears must be not greater than the endedAtDays or endedAtYears`);
            }

            const passengerInvites: SeedingPassengerInviteType[] = await Promise.all(
                Array(supplyOrders.length).fill({ id: "", userId: "", orderId: "" }).map(async (_, index) => {
                    const passenger = passengers[index], 
                          supplyOrder = supplyOrders[index];
                    const response = await this._db.insert(this.schema.PassengerInviteTable).values({
                        userId: passenger.id, 
                        orderId: supplyOrder.id, 
                        briefDescription: faker.lorem.paragraph({ min: MIN_BRIEF_DESCRIPTION_LENGTH, max: MAX_BRIEF_DESCRIPTION_LENGTH }), 
                        suggestPrice: Math.floor(Math.random() * MAX_SUGGEST_PRICE - MIN_SUGGEST_PRICE) + MIN_SUGGEST_PRICE, 
                        startCord: sql`ST_SetSRID(
                            ST_MakePoint(${faker.location.longitude()}, ${faker.location.latitude()}), 
                            4326
                        )`, 
                        endCord: sql`ST_SetSRID(
                            ST_MakePoint(${faker.location.longitude()}, ${faker.location.latitude()}), 
                            4326
                        )`, 
                        startAddress: faker.location.country()
                            + (Math.round(Math.random()) ? faker.location.city() : faker.location.county())
                            + faker.location.streetAddress(), 
                        endAddress: faker.location.country()
                            + (Math.round(Math.random()) ? faker.location.city() : faker.location.county())
                            + faker.location.streetAddress(), 
                        suggestStartAfter: isStartAfterSoon 
                            ? faker.date.soon({ days: options?.startAfterDays ?? 3 }) 
                            : faker.date.future({ years: options?.startAfterYears ?? 3 }), 
                        suggestEndedAt: isStartAfterSoon 
                            ? faker.date.soon({ days: options?.endedAtDays ?? 5 }) 
                            : faker.date.future({ years: options?.endedAtYears ?? 5 }), 
                    }).returning({
                        id: this.schema.PassengerInviteTable.id, 
                        userId: this.schema.PassengerInviteTable.userId, 
                        orderId: this.schema.PassengerInviteTable.orderId, 
                    });
                    if (!response || response.length === 0) {
                        throw ClientCreatePassengerInviteException;
                    }
                    
                    return response[0];
                })
            );

            return passengerInvites;
        } catch (error) {
            console.log("Error occurred when seeding passengerInvites:", error);
            return undefined;
        }
    }

    public getRandomPassengerInvites = async function(quantity: number): Promise<SeedingPassengerInviteType[] | undefined> {
        try {
            if (quantity > MAX_SEED_QUANTITY || quantity < MIN_SEED_QUNANTITY) {
                throw Error(`Seeding with ${quantity} data violate the maximum of ${MAX_SEED_QUANTITY} or the minimum of ${MIN_SEED_QUNANTITY}`);
            }

            const response = await this._db.select({
                id: this.schema.PassengerInviteTable.id, 
                userId: this.schema.PassengerInviteTable.userId, 
                orderId: this.schema.PassengerInviteTable.orderId, 
            }).from(this.schema.PassengerInviteTable)
              .orderBy(sql`RANDOM()`)
              .limit(quantity);
            if (!response || response.length === 0) {
                throw ClientInviteNotFoundException;
            }

            return response;
        } catch (error) {
            console.log("Error occurred when getting some random passengerInvites:", error);
            return undefined;
        }
    }
}