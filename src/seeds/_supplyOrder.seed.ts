import { faker } from "@faker-js/faker";
import { SeedingRidderType, SeedingSupplyOrderType } from "../interfaces";
import { _DatabaseInstace } from "./_db";
import { sql } from "drizzle-orm";
import { MAX_DESCRIPTION_LENGTH, MAX_INIT_PRICE, MAX_SEED_QUANTITY, MAX_TOLERABLE_RDV, MIN_DESCRIPTION_LENGTH, MIN_INIT_PRICE, MIN_SEED_QUNANTITY, MIN_TOLERABLE_RDV } from "../constants";
import { ClientCreateSupplyOrderException, ClientSupplyOrderNotFoundException } from "../exceptions";

export class SupplyOrderSeedingOperator extends(_DatabaseInstace) {
    public _seedSupplyOrders = async function(
        ridders: SeedingRidderType[], 
        isStartAfterSoon?: boolean, 
        options?: { startAfterDays?: number, startAfterYears?: number, endedAtDays?: number, endedAtYears?: number }, 
    ): Promise<SeedingSupplyOrderType[] | undefined> {
        try {
            if (ridders.length === 0) {
                throw Error(`Seeding purchaseOrders with empty ridders`);
            }
            if (options && options.startAfterDays && options.endedAtDays && options.startAfterDays >= options.endedAtDays
                || options?.startAfterYears && options.endedAtYears && options.startAfterYears >= options.endedAtYears) {
                    throw Error(`StartAfterDays or StartAfterYears must be not greater than the endedAtDays or endedAtYears`);
            }

            const supplyOrders: SeedingSupplyOrderType[] = await Promise.all(
                Array(ridders.length).fill({ id: "", userId: "" }).map(async (_, index) => {
                    const ridder = ridders[index];

                    const response: SeedingSupplyOrderType[] = await this._db.insert(this.schema.SupplyOrderTable).values({
                        creatorId: ridder.id, 
                        description: faker.lorem.paragraph({ min: MIN_DESCRIPTION_LENGTH, max: MAX_DESCRIPTION_LENGTH }), 
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
                        tolerableRDV: (Math.floor(Math.random() * (MAX_TOLERABLE_RDV - MIN_TOLERABLE_RDV)) + MIN_TOLERABLE_RDV), 
                    }).returning({
                        id: this.schema.SupplyOrderTable.id, 
                        creatorId: this.schema.SupplyOrderTable.creatorId, 
                    });
                    if (!response || response.length === 0) {
                        throw ClientCreateSupplyOrderException;
                    }

                    return response[0];
                })
            );

            return supplyOrders;

        } catch (error) {
            console.log("Error occurred when seeding supplyOrders:", error);
            return undefined;
        }
    }

    public _getRandomSupplyOrders = async function(quantity: number): Promise<SeedingSupplyOrderType[] | undefined> {
        try {
            if (quantity > MAX_SEED_QUANTITY || quantity < MIN_SEED_QUNANTITY) {
                throw Error(`Seeding with ${quantity} data violate the maximum of ${MAX_SEED_QUANTITY} or the minimum of ${MIN_SEED_QUNANTITY}`);
            }

            const response = await this._db.select({
                id: this.schema.SupplyOrderTable.id, 
                creatorId: this.schema.SupplyOrderTable.creatorId, 
            }).from(this.schema.SupplyOrderTable)
              .orderBy(sql`RANDOM()`)
              .limit(quantity);
            if (!response || response.length === 0) {
                throw ClientSupplyOrderNotFoundException;
            }

            return response;
        } catch (error) {
            console.log("Error occurred when getting some random supplyOrders:", error);
            return undefined;
        }
    }
}