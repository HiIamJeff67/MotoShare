"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderSeedingOperator = void 0;
const faker_1 = require("@faker-js/faker");
const _db_1 = require("./_db");
const constants_1 = require("../constants");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
class PurchaseOrderSeedingOperator extends _db_1._DatabaseInstace {
    constructor() {
        super(...arguments);
        this._seedPurchaseOrders = async function (passengers, isStartAfterSoon, options) {
            try {
                if (passengers.length === 0) {
                    throw Error(`Seeding purchaseOrders with empty passengers`);
                }
                if (options && options.startAfterDays && options.endedAtDays && options.startAfterDays >= options.endedAtDays
                    || options?.startAfterYears && options.endedAtYears && options.startAfterYears >= options.endedAtYears) {
                    throw Error(`StartAfterDays or StartAfterYears must be not greater than the endedAtDays or endedAtYears`);
                }
                const purchaseOrders = await Promise.all(Array(passengers.length).fill({ id: "", userId: "" }).map(async (_, index) => {
                    const passenger = passengers[index];
                    const response = await this._db.insert(this.schema.PurchaseOrderTable).values({
                        creatorId: passenger.id,
                        description: faker_1.faker.lorem.paragraph({ min: constants_1.MIN_BRIEF_DESCRIPTION_LENGTH, max: constants_1.MAX_BRIEF_DESCRIPTION_LENGTH }),
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
                        isUrgent: (Math.round(Math.random()) === 0),
                    }).returning({
                        id: this.schema.PurchaseOrderTable.id,
                        creatorId: this.schema.PurchaseOrderTable.creatorId,
                    });
                    if (!response || response.length === 0) {
                        throw exceptions_1.ClientCreatePurchaseOrderException;
                    }
                    return response[0];
                }));
                return purchaseOrders;
            }
            catch (error) {
                console.log("Error occurred when seeding purchaseOrders:", error);
                return undefined;
            }
        };
        this._getRandomPurchaseOrders = async function (quantity) {
            try {
                if (quantity > constants_1.MAX_SEED_QUANTITY || quantity < constants_1.MIN_SEED_QUNANTITY) {
                    throw Error(`Seeding with ${quantity} data violate the maximum of ${constants_1.MAX_SEED_QUANTITY} or the minimum of ${constants_1.MIN_SEED_QUNANTITY}`);
                }
                const response = await this._db.select({
                    id: this.schema.PurchaseOrderTable.id,
                    creatorId: this.schema.PurchaseOrderTable.creatorId,
                }).from(this.schema.PurchaseOrderTable)
                    .orderBy((0, drizzle_orm_1.sql) `RANDOM()`)
                    .limit(quantity);
                if (!response || response.length === 0) {
                    throw exceptions_1.ClientPurchaseOrderNotFoundException;
                }
                return response;
            }
            catch (error) {
                console.log("Error occurred when getting some random purchaseOrders:", error);
                return undefined;
            }
        };
    }
}
exports.PurchaseOrderSeedingOperator = PurchaseOrderSeedingOperator;
;
//# sourceMappingURL=_purchaseOrder.seed.js.map