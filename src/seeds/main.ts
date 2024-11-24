import { exit } from "process";
import { PassengerSeedingOperator } from "./_passenger.seed";
import { PassengerInviteSeedingOperator } from "./_passengerInvite.seed";
import { PurchaseOrderSeedingOperator } from "./_purchaseOrder.seed";
import { RidderSeedingOperator } from "./_ridder.seed";
import { RidderInviteSeedingOperator } from "./_ridderInvite.seed";
import { SupplyOrderSeedingOperator } from "./_supplyOrder.seed";

async function main() {
    const __quantity = 10;

    const pOp = new PassengerSeedingOperator();
    const rOp = new RidderSeedingOperator();
    const purOp = new PurchaseOrderSeedingOperator();
    const supOp = new SupplyOrderSeedingOperator();
    const pIvOp = new PassengerInviteSeedingOperator();
    const rIvOp = new RidderInviteSeedingOperator();

    try {
        // const passengers = await pOp._getRandomPassengers(__quantity);
        // if (!passengers || passengers.length === 0) throw Error(`Cannot seeding the passengers`);
        // console.log(passengers);

        const ridders = await rOp._getRandomRidders(__quantity);
        if (!ridders || ridders.length === 0) throw Error(`Cannot seeding the ridders`);
        console.log(ridders);
        
        const purchaseOrders = await purOp._getRandomPurchaseOrders(__quantity);
        if (!purchaseOrders || purchaseOrders.length === 0) throw Error(`Cannot seeding the purchaseOrders`);
        console.log(purchaseOrders);

        // const supplyOrders = await supOp._seedSupplyOrders(ridders, false);
        // if (!supplyOrders || supplyOrders.length === 0) throw Error(`Cannot seeding the supplyOrders`);
        // console.log(supplyOrders);

        // const passengerInvites = await pIvOp._seedPassengerInvites(passengers, supplyOrders);
        // if (!passengerInvites || passengerInvites.length === 0) throw Error(`Cannot seeding the passengerInvites`);
        // console.log(passengerInvites);

        const ridderInvites = await rIvOp._seedRidderInvites(ridders, purchaseOrders);
        if (!ridderInvites || ridderInvites.length === 0) throw Error(`Cannot seeding the ridderInvites`);
        console.log(ridderInvites);

        // const res = await pOp._getRandomPassengers(__quantity);
        // console.log(res);
    } catch (error) {
        console.log(error);
    }
}

main();