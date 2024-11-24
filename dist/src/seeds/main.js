"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _passenger_seed_1 = require("./_passenger.seed");
const _passengerInvite_seed_1 = require("./_passengerInvite.seed");
const _purchaseOrder_seed_1 = require("./_purchaseOrder.seed");
const _ridder_seed_1 = require("./_ridder.seed");
const _ridderInvite_seed_1 = require("./_ridderInvite.seed");
const _supplyOrder_seed_1 = require("./_supplyOrder.seed");
async function main() {
    const __quantity = 10;
    const pOp = new _passenger_seed_1.PassengerSeedingOperator();
    const rOp = new _ridder_seed_1.RidderSeedingOperator();
    const purOp = new _purchaseOrder_seed_1.PurchaseOrderSeedingOperator();
    const supOp = new _supplyOrder_seed_1.SupplyOrderSeedingOperator();
    const pIvOp = new _passengerInvite_seed_1.PassengerInviteSeedingOperator();
    const rIvOp = new _ridderInvite_seed_1.RidderInviteSeedingOperator();
    try {
        const ridders = await rOp._getRandomRidders(__quantity);
        if (!ridders || ridders.length === 0)
            throw Error(`Cannot seeding the ridders`);
        console.log(ridders);
        const purchaseOrders = await purOp._getRandomPurchaseOrders(__quantity);
        if (!purchaseOrders || purchaseOrders.length === 0)
            throw Error(`Cannot seeding the purchaseOrders`);
        console.log(purchaseOrders);
        const ridderInvites = await rIvOp._seedRidderInvites(ridders, purchaseOrders);
        if (!ridderInvites || ridderInvites.length === 0)
            throw Error(`Cannot seeding the ridderInvites`);
        console.log(ridderInvites);
    }
    catch (error) {
        console.log(error);
    }
}
main();
//# sourceMappingURL=main.js.map