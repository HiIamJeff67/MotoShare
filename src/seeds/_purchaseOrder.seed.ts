import { faker } from "@faker-js/faker";
import { SeedingPurchaseOrderType, SeedingPassengerType } from "../interfaces";
import { _DatabaseInstace } from "./_db";
import { MAX_BRIEF_DESCRIPTION_LENGTH, MAX_INIT_PRICE, MAX_SEED_QUANTITY, MIN_BRIEF_DESCRIPTION_LENGTH, MIN_INIT_PRICE, MIN_SEED_QUNANTITY } from "../constants";
import { sql } from "drizzle-orm";
import { ClientCreatePurchaseOrderException, ClientPurchaseOrderNotFoundException } from "../exceptions";

export class PurchaseOrderSeedingOperator extends _DatabaseInstace {
    public _seedPurchaseOrders = async function(
        passengers: SeedingPassengerType[], 
        isStartAfterSoon?: boolean, 
        options?: { startAfterDays?: number, startAfterYears?: number, endedAtDays?: number, endedAtYears?: number }, 
    ): Promise<SeedingPurchaseOrderType[] | undefined> {
        try {
            if (passengers.length === 0) {
                throw Error(`Seeding purchaseOrders with empty passengers`);
            }
            if (options && options.startAfterDays && options.endedAtDays && options.startAfterDays >= options.endedAtDays
                || options?.startAfterYears && options.endedAtYears && options.startAfterYears >= options.endedAtYears) {
                    throw Error(`StartAfterDays or StartAfterYears must be not greater than the endedAtDays or endedAtYears`);
            }

            const purchaseOrders: SeedingPurchaseOrderType[] = await Promise.all(
                Array(passengers.length).fill({ id: "", userId: "" }).map(async (_, index) => {
                    const passenger = passengers[index];

                    const response: SeedingPurchaseOrderType[] = await this._db.insert(this.schema.PurchaseOrderTable).values({
                        creatorId: passenger.id, 
                        description: faker.lorem.paragraph({ min: MIN_BRIEF_DESCRIPTION_LENGTH, max: MAX_BRIEF_DESCRIPTION_LENGTH }), 
                        initPrice: Math.floor(Math.random() * MAX_INIT_PRICE - MIN_INIT_PRICE) + MIN_INIT_PRICE, 
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
                        startAfter: isStartAfterSoon 
                            ? faker.date.soon({ days: options?.startAfterDays ?? 3 }) 
                            : faker.date.future({ years: options?.startAfterYears ?? 3 }), 
                        endedAt: isStartAfterSoon 
                            ? faker.date.soon({ days: options?.endedAtDays ?? 5 }) 
                            : faker.date.future({ years: options?.endedAtYears ?? 5 }), 
                        isUrgent: (Math.round(Math.random()) === 0), 
                    }).returning({
                        id: this.schema.PurchaseOrderTable.id, 
                        creatorId: this.schema.PurchaseOrderTable.creatorId, 
                    });
                    if (!response || response.length === 0) {
                        throw ClientCreatePurchaseOrderException;
                    }

                    return response[0];
                })
            );

            return purchaseOrders;

        } catch (error) {
            console.log("Error occurred when seeding purchaseOrders:", error);
            return undefined;
        }
    }

    public _getRandomPurchaseOrders = async function(quantity: number): Promise<SeedingPurchaseOrderType[] | undefined> {
        try {
            if (quantity > MAX_SEED_QUANTITY || quantity < MIN_SEED_QUNANTITY) {
                throw Error(`Seeding with ${quantity} data violate the maximum of ${MAX_SEED_QUANTITY} or the minimum of ${MIN_SEED_QUNANTITY}`);
            }

            const response = await this._db.select({
                id: this.schema.PurchaseOrderTable.id, 
                creatorId: this.schema.PurchaseOrderTable.creatorId, 
            }).from(this.schema.PurchaseOrderTable)
              .orderBy(sql`RANDOM()`)
              .limit(quantity);
            if (!response || response.length === 0) {
                throw ClientPurchaseOrderNotFoundException;
            }

            return response;
        } catch (error) {
            console.log("Error occurred when getting some random purchaseOrders:", error);
            return undefined;
        }
    }
};