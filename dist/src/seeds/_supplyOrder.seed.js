"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyOrderSeedingOperator = void 0;
const faker_1 = require("@faker-js/faker");
const _db_1 = require("./_db");
const drizzle_orm_1 = require("drizzle-orm");
const constants_1 = require("../constants");
const exceptions_1 = require("../exceptions");
class SupplyOrderSeedingOperator extends (_db_1._DatabaseInstace) {
    constructor() {
        super(...arguments);
        this._seedSupplyOrders = async function (ridders, isStartAfterSoon, options) {
            try {
                if (ridders.length === 0) {
                    throw Error(`Seeding purchaseOrders with empty ridders`);
                }
                if (options && options.startAfterDays && options.endedAtDays && options.startAfterDays >= options.endedAtDays
                    || options?.startAfterYears && options.endedAtYears && options.startAfterYears >= options.endedAtYears) {
                    throw Error(`StartAfterDays or StartAfterYears must be not greater than the endedAtDays or endedAtYears`);
                }
                const supplyOrders = await Promise.all(Array(ridders.length).fill({ id: "", userId: "" }).map(async (_, index) => {
                    const ridder = ridders[index];
                    const response = await this._db.insert(this.schema.SupplyOrderTable).values({
                        creatorId: ridder.id,
                        description: faker_1.faker.lorem.paragraph({ min: constants_1.MIN_DESCRIPTION_LENGTH, max: constants_1.MAX_DESCRIPTION_LENGTH }),
                        initPrice: Math.floor(Math.random() * constants_1.MAX_INIT_PRICE - constants_1.MIN_INIT_PRICE) + constants_1.MIN_INIT_PRICE,
                        startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
                            ST_MakePoint(${faker_1.faker.location.longitude()}, ${faker_1.faker.location.latitude()}), 
                            4326
                        )`,
                        endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
                            ST_MakePoint(${faker_1.faker.location.longitude()}, ${faker_1.faker.location.latitude()}), 
                            4326
                        )`,
                        startAddress: faker_1.faker.location.country()
                            + (Math.round(Math.random()) ? faker_1.faker.location.city() : faker_1.faker.location.county())
                            + faker_1.faker.location.streetAddress(),
                        endAddress: faker_1.faker.location.country()
                            + (Math.round(Math.random()) ? faker_1.faker.location.city() : faker_1.faker.location.county())
                            + faker_1.faker.location.streetAddress(),
                        startAfter: isStartAfterSoon
                            ? faker_1.faker.date.soon({ days: options?.startAfterDays ?? 3 })
                            : faker_1.faker.date.future({ years: options?.startAfterYears ?? 3 }),
                        endedAt: isStartAfterSoon
                            ? faker_1.faker.date.soon({ days: options?.endedAtDays ?? 5 })
                            : faker_1.faker.date.future({ years: options?.endedAtYears ?? 5 }),
                        tolerableRDV: (Math.floor(Math.random() * (constants_1.MAX_TOLERABLE_RDV - constants_1.MIN_TOLERABLE_RDV)) + constants_1.MIN_TOLERABLE_RDV),
                    }).returning({
                        id: this.schema.SupplyOrderTable.id,
                        creatorId: this.schema.SupplyOrderTable.creatorId,
                    });
                    if (!response || response.length === 0) {
                        throw exceptions_1.ClientCreateSupplyOrderException;
                    }
                    return response[0];
                }));
                return supplyOrders;
            }
            catch (error) {
                console.log("Error occurred when seeding supplyOrders:", error);
                return undefined;
            }
        };
        this._getRandomSupplyOrders = async function (quantity) {
            try {
                if (quantity > constants_1.MAX_SEED_QUANTITY || quantity < constants_1.MIN_SEED_QUNANTITY) {
                    throw Error(`Seeding with ${quantity} data violate the maximum of ${constants_1.MAX_SEED_QUANTITY} or the minimum of ${constants_1.MIN_SEED_QUNANTITY}`);
                }
                const response = await this._db.select({
                    id: this.schema.SupplyOrderTable.id,
                    creatorId: this.schema.SupplyOrderTable.creatorId,
                }).from(this.schema.SupplyOrderTable)
                    .orderBy((0, drizzle_orm_1.sql) `RANDOM()`)
                    .limit(quantity);
                if (!response || response.length === 0) {
                    throw exceptions_1.ClientSupplyOrderNotFoundException;
                }
                return response;
            }
            catch (error) {
                console.log("Error occurred when getting some random supplyOrders:", error);
                return undefined;
            }
        };
    }
}
exports.SupplyOrderSeedingOperator = SupplyOrderSeedingOperator;
//# sourceMappingURL=_supplyOrder.seed.js.map