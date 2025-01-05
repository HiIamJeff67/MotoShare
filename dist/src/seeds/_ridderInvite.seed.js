"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderInviteSeedingOperator = void 0;
const faker_1 = require("@faker-js/faker");
const _db_1 = require("./_db");
const constants_1 = require("../constants");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
class RidderInviteSeedingOperator extends (_db_1._DatabaseInstace) {
    constructor() {
        super(...arguments);
        this._seedRidderInvites = async function (ridders, purchaseOrders, isStartAfterSoon, options) {
            try {
                if (ridders.length !== purchaseOrders.length || ridders.length === 0) {
                    throw Error(`Seeding passengerInvites with empty ridder and purchaseOrder`);
                }
                if (options && options.startAfterDays && options.endedAtDays && options.startAfterDays >= options.endedAtDays
                    || options?.startAfterYears && options.endedAtYears && options.startAfterYears >= options.endedAtYears) {
                    throw Error(`StartAfterDays or StartAfterYears must be not greater than the endedAtDays or endedAtYears`);
                }
                const ridderInvites = await Promise.all(Array(purchaseOrders.length).fill({ id: "", userId: "", orderId: "" }).map(async (_, index) => {
                    const ridder = ridders[index], purchaseOrder = purchaseOrders[index];
                    const response = await this._db.insert(this.schema.RidderInviteTable).values({
                        userId: ridder.id,
                        orderId: purchaseOrder.id,
                        briefDescription: faker_1.faker.lorem.paragraph({ min: constants_1.MIN_BRIEF_DESCRIPTION_LENGTH, max: constants_1.MAX_BRIEF_DESCRIPTION_LENGTH }),
                        suggestPrice: Math.floor(Math.random() * constants_1.MAX_SUGGEST_PRICE - constants_1.MIN_SUGGEST_PRICE) + constants_1.MIN_SUGGEST_PRICE,
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
                        suggestStartAfter: isStartAfterSoon
                            ? faker_1.faker.date.soon({ days: options?.startAfterDays ?? 3 })
                            : faker_1.faker.date.future({ years: options?.startAfterYears ?? 3 }),
                        suggestEndedAt: isStartAfterSoon
                            ? faker_1.faker.date.soon({ days: options?.endedAtDays ?? 5 })
                            : faker_1.faker.date.future({ years: options?.endedAtYears ?? 5 }),
                    }).returning({
                        id: this.schema.RidderInviteTable.id,
                        userId: this.schema.RidderInviteTable.userId,
                        orderId: this.schema.RidderInviteTable.orderId,
                    });
                    if (!response || response.length === 0) {
                        throw exceptions_1.ClientCreateRidderInviteException;
                    }
                    return response[0];
                }));
                return ridderInvites;
            }
            catch (error) {
                console.log("Error occurred when seeding ridderInvites:", error);
                return undefined;
            }
        };
        this.getRandomRidderInvites = async function (quantity) {
            try {
                if (quantity > constants_1.MAX_SEED_QUANTITY || quantity < constants_1.MIN_SEED_QUNANTITY) {
                    throw Error(`Seeding with ${quantity} data violate the maximum of ${constants_1.MAX_SEED_QUANTITY} or the minimum of ${constants_1.MIN_SEED_QUNANTITY}`);
                }
                const response = await this._db.select({
                    id: this.schema.RidderInviteTable.id,
                    userId: this.schema.RidderInviteTable.userId,
                    orderId: this.schema.RidderInviteTable.orderId,
                }).from(this.schema.RidderInviteTable)
                    .orderBy((0, drizzle_orm_1.sql) `RANDOM()`)
                    .limit(quantity);
                if (!response || response.length === 0) {
                    throw exceptions_1.ClientInviteNotFoundException;
                }
                return response;
            }
            catch (error) {
                console.log("Error occurred when getting some random ridderInvites:", error);
                return undefined;
            }
        };
    }
}
exports.RidderInviteSeedingOperator = RidderInviteSeedingOperator;
//# sourceMappingURL=_ridderInvite.seed.js.map