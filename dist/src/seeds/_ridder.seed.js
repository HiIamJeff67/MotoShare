"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderSeedingOperator = void 0;
const _db_1 = require("./_db");
const faker_1 = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const constants_1 = require("../constants");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
class RidderSeedingOperator extends (_db_1._DatabaseInstace) {
    constructor() {
        super(...arguments);
        this._seedRidders = async function (quantity) {
            try {
                if (quantity > constants_1.MAX_SEED_QUANTITY || quantity < constants_1.MIN_SEED_QUNANTITY) {
                    throw Error(`Seeding with ${quantity} data violate the maximum of ${constants_1.MAX_SEED_QUANTITY} or the minimum of ${constants_1.MIN_SEED_QUNANTITY}`);
                }
                const ridders = await Promise.all(Array(quantity).fill({ id: "", userName: "" }).map(async () => {
                    return await this._db.transaction(async (tx) => {
                        const hash = await bcrypt.hash(faker_1.faker.internet.password(), Number(process.env.SALT_OR_ROUND));
                        const responseOfCreatingRidder = await tx.insert(this.schema.RidderTable).values({
                            email: faker_1.faker.internet.email(),
                            userName: faker_1.faker.person.firstName() + (Math.floor(Math.random() * 1000)).toString(),
                            password: hash,
                            accessToken: "FAKE_SEEDING_USER",
                        }).returning({
                            id: this.schema.RidderTable.id,
                            userName: this.schema.RidderTable.userName,
                        });
                        if (!responseOfCreatingRidder || responseOfCreatingRidder.length === 0) {
                            throw exceptions_1.ClientSignUpUserException;
                        }
                        const responseOfCreatingRidderInfo = await tx.insert(this.schema.RidderInfoTable).values({
                            userId: responseOfCreatingRidder[0].id,
                        }).returning();
                        if (!responseOfCreatingRidderInfo || responseOfCreatingRidderInfo.length === 0) {
                            throw exceptions_1.ClientCreateRidderInfoException;
                        }
                        const responseOfCreatingRidderAuth = await tx.insert(this.schema.RidderAuthTable).value({
                            userId: responseOfCreatingRidder[0].id,
                            authCode: this.__getRandomAuthCode(),
                            authCodeExpiredAt: new Date((new Date()).getTime() + Number(process.env.AUTH_CODE_EXPIRED_IN) * 60000),
                        }).returning();
                        if (!responseOfCreatingRidderAuth || responseOfCreatingRidderAuth.length === 0) {
                            throw exceptions_1.ClientCreateRidderAuthException;
                        }
                        return responseOfCreatingRidder[0];
                    });
                }));
                return ridders;
            }
            catch (error) {
                console.log("Error occurred when seeding ridders:", error);
                return undefined;
            }
        };
        this._getRandomRidders = async function (quantity) {
            try {
                if (quantity > constants_1.MAX_SEED_QUANTITY || quantity < constants_1.MIN_SEED_QUNANTITY) {
                    throw Error(`Seeding with ${quantity} data violate the maximum of ${constants_1.MAX_SEED_QUANTITY} or the minimum of ${constants_1.MIN_SEED_QUNANTITY}`);
                }
                const response = await this._db.select({
                    id: this.schema.RidderTable.id,
                    userName: this.schema.RidderTable.userName,
                }).from(this.schema.RidderTable)
                    .orderBy((0, drizzle_orm_1.sql) `RANDOM()`)
                    .limit(quantity);
                if (!response || response.length === 0) {
                    throw Error();
                }
                return response;
            }
            catch (error) {
                console.log("Error occurred when getting some random ridders:", error);
                return undefined;
            }
        };
    }
    __getRandomAuthCode() {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }
}
exports.RidderSeedingOperator = RidderSeedingOperator;
//# sourceMappingURL=_ridder.seed.js.map