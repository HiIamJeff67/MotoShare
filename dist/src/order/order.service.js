"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const drizzle_orm_1 = require("drizzle-orm");
const supplyOrder_schema_1 = require("../drizzle/schema/supplyOrder.schema");
const order_schema_1 = require("../drizzle/schema/order.schema");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const exceptions_1 = require("../exceptions");
const purchaseOrder_schema_1 = require("../drizzle/schema/purchaseOrder.schema");
const history_schema_1 = require("../drizzle/schema/history.schema");
let OrderService = class OrderService {
    constructor(db) {
        this.db = db;
    }
    async getOrderStatusById(id) {
        return await this.db.select({
            passengerStatus: order_schema_1.OrderTable.passengerStatus,
            ridderStatus: order_schema_1.OrderTable.ridderStatus,
        }).from(order_schema_1.OrderTable)
            .where((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id));
    }
    async getOrderById(id, userId) {
        return await this.db.select({
            id: order_schema_1.OrderTable.id,
            passengerName: passenger_schema_1.PassengerTable.userName,
            ridderName: ridder_schema_1.RidderTable.userName,
            finalPrice: order_schema_1.OrderTable.finalPrice,
            passengerDescription: order_schema_1.OrderTable.passengerDescription,
            ridderDescription: order_schema_1.OrderTable.ridderDescription,
            finalStartCord: order_schema_1.OrderTable.finalStartCord,
            finalEndCord: order_schema_1.OrderTable.finalEndCord,
            finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
            finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
            startAfter: order_schema_1.OrderTable.startAfter,
            endedAt: order_schema_1.OrderTable.endedAt,
            passengerStatus: order_schema_1.OrderTable.passengerStatus,
            ridderStatus: order_schema_1.OrderTable.ridderStatus,
            passengerAvatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            ridderAvatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            passengerPhoneNumber: passengerInfo_schema_1.PassengerInfoTable.phoneNumber,
            ridderPhoneNumber: ridderInfo_schema_1.RidderInfoTable.phoneNumber,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            motocycleLicense: ridderInfo_schema_1.RidderInfoTable.motocycleLicense,
            motocyclePhotoUrl: ridderInfo_schema_1.RidderInfoTable.motocyclePhotoUrl,
            createdAt: order_schema_1.OrderTable.createdAt,
            updatedAt: order_schema_1.OrderTable.updatedAt,
        }).from(order_schema_1.OrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerId, userId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderId, userId))))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, order_schema_1.OrderTable.passengerId))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, order_schema_1.OrderTable.ridderId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, order_schema_1.OrderTable.passengerId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, order_schema_1.OrderTable.ridderId));
    }
    async searchPaginationOrderByPassengerId(passengerId, ridderName = undefined, limit, offset) {
        const query = this.db.select({
            id: order_schema_1.OrderTable.id,
            ridderName: ridder_schema_1.RidderTable.userName,
            finalStartCord: order_schema_1.OrderTable.finalStartCord,
            finalEndCord: order_schema_1.OrderTable.finalEndCord,
            finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
            finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
            ridderAvatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            finalPrice: order_schema_1.OrderTable.finalPrice,
            startAfter: order_schema_1.OrderTable.startAfter,
            endedAt: order_schema_1.OrderTable.endedAt,
            createdAt: order_schema_1.OrderTable.createdAt,
            ridderPhoneNumber: ridderInfo_schema_1.RidderInfoTable.phoneNumber,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            passengerStatus: order_schema_1.OrderTable.passengerStatus,
            ridderStatus: order_schema_1.OrderTable.ridderStatus,
            updatedAt: order_schema_1.OrderTable.updatedAt,
        }).from(order_schema_1.OrderTable);
        if (ridderName) {
            query.leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, order_schema_1.OrderTable.ridderId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerId, passengerId), (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.userName, ridderName)));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerId, passengerId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, order_schema_1.OrderTable.ridderId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.desc)(order_schema_1.OrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchPaginationOrderByRidderId(ridderId, passengerName = undefined, limit, offset) {
        const query = this.db.select({
            id: order_schema_1.OrderTable.id,
            finalStartCord: order_schema_1.OrderTable.finalStartCord,
            finalEndCord: order_schema_1.OrderTable.finalEndCord,
            finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
            finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
            passengerName: passenger_schema_1.PassengerTable.userName,
            passengerAvatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            finalPrice: order_schema_1.OrderTable.finalPrice,
            startAfter: order_schema_1.OrderTable.startAfter,
            endedAt: order_schema_1.OrderTable.endedAt,
            createdAt: order_schema_1.OrderTable.createdAt,
            passengerPhoneNumber: passengerInfo_schema_1.PassengerInfoTable.phoneNumber,
            passengerStatus: order_schema_1.OrderTable.passengerStatus,
            ridderStatus: order_schema_1.OrderTable.ridderStatus,
            updatedAt: order_schema_1.OrderTable.updatedAt,
        }).from(order_schema_1.OrderTable);
        if (passengerName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, order_schema_1.OrderTable.passengerId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderId, ridderId), (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, passengerName)));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderId, ridderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, order_schema_1.OrderTable.passengerId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.desc)(order_schema_1.OrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async toStartedPassengerStatusById(id, passengerId) {
        return await this.db.update(order_schema_1.OrderTable).set({
            passengerStatus: "STARTED",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerId, passengerId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerStatus, "UNSTARTED"))).returning({
            passengerStatus: order_schema_1.OrderTable.passengerStatus,
        });
    }
    async toStartedRidderStatusById(id, ridderId) {
        return await this.db.update(order_schema_1.OrderTable).set({
            ridderStatus: "STARTED",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderId, ridderId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderStatus, "UNSTARTED"))).returning({
            ridderStatus: order_schema_1.OrderTable.ridderStatus,
        });
    }
    async toUnpaidPassengerStatusById(id, passengerId) {
        return await this.db.update(order_schema_1.OrderTable).set({
            passengerStatus: "UNPAID",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerId, passengerId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerStatus, "STARTED"))).returning({
            passengerStatus: order_schema_1.OrderTable.passengerStatus,
        });
    }
    async toUnpaidRidderStatusById(id, ridderId) {
        return await this.db.update(order_schema_1.OrderTable).set({
            ridderStatus: "UNPAID",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderId, ridderId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderStatus, "STARTED"))).returning({
            ridderStatus: order_schema_1.OrderTable.ridderStatus,
        });
    }
    async toFinishedPassengerStatusById(id, passengerId) {
        return this.db.transaction(async (tx) => {
            const responseOfUpdatingOrder = await tx.update(order_schema_1.OrderTable).set({
                passengerStatus: "FINISHED",
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerId, passengerId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerStatus, "UNPAID"))).returning({
                prevOrderId: order_schema_1.OrderTable.prevOrderId,
                passengerStatus: order_schema_1.OrderTable.passengerStatus,
                ridderStatus: order_schema_1.OrderTable.ridderStatus,
            });
            if (!responseOfUpdatingOrder || responseOfUpdatingOrder.length === 0) {
                throw exceptions_1.ClientOrderNotFoundException;
            }
            if (responseOfUpdatingOrder[0].ridderStatus === "FINISHED") {
                const prevOrderData = responseOfUpdatingOrder[0].prevOrderId.split(" ");
                if (!prevOrderData || prevOrderData.length !== 2) {
                    throw exceptions_1.ApiPrevOrderIdFormException;
                }
                const [type, prevOrderId] = prevOrderData;
                if (type === "PurchaseOrder") {
                    const responseOfDeletingPurchaseOrder = await tx.delete(purchaseOrder_schema_1.PurchaseOrderTable)
                        .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, prevOrderId))
                        .returning({
                        id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                    });
                    if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                        throw exceptions_1.ClientPurchaseOrderNotFoundException;
                    }
                }
                else if (type === "SupplyOrder") {
                    const responseOfDeletingSupplyOrder = await tx.delete(supplyOrder_schema_1.SupplyOrderTable)
                        .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, prevOrderId))
                        .returning({
                        id: supplyOrder_schema_1.SupplyOrderTable.id,
                    });
                    if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                        throw exceptions_1.ClientSupplyOrderNotFoundException;
                    }
                }
                else {
                    throw exceptions_1.ApiPrevOrderIdFormException;
                }
                const responseOfDeletingOrder = await tx.delete(order_schema_1.OrderTable)
                    .where((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id))
                    .returning({
                    passengerId: order_schema_1.OrderTable.passengerId,
                    ridderId: order_schema_1.OrderTable.ridderId,
                    prevOrderId: order_schema_1.OrderTable.prevOrderId,
                    finalPrice: order_schema_1.OrderTable.finalPrice,
                    passengerDescription: order_schema_1.OrderTable.passengerDescription,
                    ridderDescription: order_schema_1.OrderTable.ridderDescription,
                    finalStartCord: order_schema_1.OrderTable.finalStartCord,
                    finalEndCord: order_schema_1.OrderTable.finalEndCord,
                    finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
                    finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
                    startAfter: order_schema_1.OrderTable.startAfter,
                    endedAt: order_schema_1.OrderTable.endedAt,
                });
                if (!responseOfDeletingOrder || responseOfDeletingOrder.length === 0) {
                    throw exceptions_1.ClientOrderNotFoundException;
                }
                const responseOfCreatingHistory = await tx.insert(history_schema_1.HistoryTable).values({
                    ridderId: responseOfDeletingOrder[0].ridderId,
                    passengerId: responseOfDeletingOrder[0].passengerId,
                    prevOrderId: responseOfDeletingOrder[0].prevOrderId,
                    finalPrice: responseOfDeletingOrder[0].finalPrice,
                    passengerDescription: responseOfDeletingOrder[0].passengerDescription,
                    ridderDescription: responseOfDeletingOrder[0].ridderDescription,
                    finalStartCord: responseOfDeletingOrder[0].finalStartCord,
                    finalEndCord: responseOfDeletingOrder[0].finalEndCord,
                    finalStartAddress: responseOfDeletingOrder[0].finalStartAddress,
                    finalEndAddress: responseOfDeletingOrder[0].finalEndAddress,
                    startAfter: responseOfDeletingOrder[0].startAfter,
                    endedAt: responseOfDeletingOrder[0].endedAt,
                    status: "FINISHED",
                }).returning({
                    historyId: history_schema_1.HistoryTable.id,
                    historyStatus: history_schema_1.HistoryTable.status,
                });
                if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
                    throw exceptions_1.ClientCreateHistoryException;
                }
                return [{
                        ...responseOfCreatingHistory[0],
                    }];
            }
            return responseOfUpdatingOrder;
        });
    }
    async toFinishedRidderStatusById(id, ridderId) {
        return this.db.transaction(async (tx) => {
            const responseOfUpdatingOrder = await tx.update(order_schema_1.OrderTable).set({
                ridderStatus: "FINISHED",
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderId, ridderId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderStatus, "UNPAID"))).returning({
                prevOrderId: order_schema_1.OrderTable.prevOrderId,
                passengerStatus: order_schema_1.OrderTable.passengerStatus,
                ridderStatus: order_schema_1.OrderTable.ridderStatus,
            });
            if (!responseOfUpdatingOrder || responseOfUpdatingOrder.length === 0) {
                throw exceptions_1.ClientOrderNotFoundException;
            }
            if (responseOfUpdatingOrder[0].passengerStatus === "FINISHED") {
                const prevOrderData = responseOfUpdatingOrder[0].prevOrderId.split(" ");
                if (!prevOrderData || prevOrderData.length !== 2) {
                    throw exceptions_1.ApiPrevOrderIdFormException;
                }
                const [type, prevOrderId] = prevOrderData;
                if (type === "PurchaseOrder") {
                    const responseOfDeletingPurchaseOrder = await tx.delete(purchaseOrder_schema_1.PurchaseOrderTable)
                        .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, prevOrderId))
                        .returning({
                        id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                    });
                    if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                        throw exceptions_1.ClientPurchaseOrderNotFoundException;
                    }
                }
                else if (type === "SupplyOrder") {
                    const responseOfDeletingSupplyOrder = await tx.delete(supplyOrder_schema_1.SupplyOrderTable)
                        .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, prevOrderId))
                        .returning({
                        id: supplyOrder_schema_1.SupplyOrderTable.id,
                    });
                    if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                        throw exceptions_1.ClientSupplyOrderNotFoundException;
                    }
                }
                else {
                    throw exceptions_1.ApiPrevOrderIdFormException;
                }
                const responseOfDeletingOrder = await tx.delete(order_schema_1.OrderTable)
                    .where((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id))
                    .returning({
                    passengerId: order_schema_1.OrderTable.passengerId,
                    ridderId: order_schema_1.OrderTable.ridderId,
                    prevOrderId: order_schema_1.OrderTable.prevOrderId,
                    finalPrice: order_schema_1.OrderTable.finalPrice,
                    passengerDescription: order_schema_1.OrderTable.passengerDescription,
                    ridderDescription: order_schema_1.OrderTable.ridderDescription,
                    finalStartCord: order_schema_1.OrderTable.finalStartCord,
                    finalEndCord: order_schema_1.OrderTable.finalEndCord,
                    finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
                    finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
                    startAfter: order_schema_1.OrderTable.startAfter,
                    endedAt: order_schema_1.OrderTable.endedAt,
                });
                if (!responseOfDeletingOrder || responseOfDeletingOrder.length === 0) {
                    throw exceptions_1.ClientOrderNotFoundException;
                }
                const responseOfCreatingHistory = await tx.insert(history_schema_1.HistoryTable).values({
                    ridderId: responseOfDeletingOrder[0].ridderId,
                    passengerId: responseOfDeletingOrder[0].passengerId,
                    prevOrderId: responseOfDeletingOrder[0].prevOrderId,
                    finalPrice: responseOfDeletingOrder[0].finalPrice,
                    passengerDescription: responseOfDeletingOrder[0].passengerDescription,
                    ridderDescription: responseOfDeletingOrder[0].ridderDescription,
                    finalStartCord: responseOfDeletingOrder[0].finalStartCord,
                    finalEndCord: responseOfDeletingOrder[0].finalEndCord,
                    finalStartAddress: responseOfDeletingOrder[0].finalStartAddress,
                    finalEndAddress: responseOfDeletingOrder[0].finalEndAddress,
                    startAfter: responseOfDeletingOrder[0].startAfter,
                    endedAt: responseOfDeletingOrder[0].endedAt,
                    status: "FINISHED",
                }).returning({
                    historyId: history_schema_1.HistoryTable.id,
                    historyStatus: history_schema_1.HistoryTable.status,
                });
                if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
                    throw exceptions_1.ClientCreateHistoryException;
                }
                return [{
                        ...responseOfCreatingHistory[0],
                    }];
            }
            return responseOfUpdatingOrder;
        });
    }
    async cancelAndDeleteOrderById(id, userId) {
        return await this.db.transaction(async (tx) => {
            const responseOfDeletingOrder = await tx.delete(order_schema_1.OrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.ne)(order_schema_1.OrderTable.passengerStatus, "FINISHED"), (0, drizzle_orm_1.ne)(order_schema_1.OrderTable.ridderStatus, "FINISHED"), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.passengerId, userId), (0, drizzle_orm_1.eq)(order_schema_1.OrderTable.ridderId, userId))))
                .returning({
                passengerId: order_schema_1.OrderTable.passengerId,
                ridderId: order_schema_1.OrderTable.ridderId,
                prevOrderId: order_schema_1.OrderTable.prevOrderId,
                finalPrice: order_schema_1.OrderTable.finalPrice,
                passengerDescription: order_schema_1.OrderTable.passengerDescription,
                ridderDescription: order_schema_1.OrderTable.ridderDescription,
                finalStartCord: order_schema_1.OrderTable.finalStartCord,
                finalEndCord: order_schema_1.OrderTable.finalEndCord,
                finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
                finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
                startAfter: order_schema_1.OrderTable.startAfter,
                endedAt: order_schema_1.OrderTable.endedAt,
            });
            if (!responseOfDeletingOrder || responseOfDeletingOrder.length === 0) {
                throw exceptions_1.ClientOrderNotFoundException;
            }
            const responseOfCreatingHistory = await tx.insert(history_schema_1.HistoryTable).values({
                ridderId: responseOfDeletingOrder[0].ridderId,
                passengerId: responseOfDeletingOrder[0].passengerId,
                prevOrderId: responseOfDeletingOrder[0].prevOrderId,
                finalPrice: responseOfDeletingOrder[0].finalPrice,
                passengerDescription: responseOfDeletingOrder[0].passengerDescription,
                ridderDescription: responseOfDeletingOrder[0].ridderDescription,
                finalStartCord: responseOfDeletingOrder[0].finalStartCord,
                finalEndCord: responseOfDeletingOrder[0].finalEndCord,
                finalStartAddress: responseOfDeletingOrder[0].finalStartAddress,
                finalEndAddress: responseOfDeletingOrder[0].finalEndAddress,
                startAfter: responseOfDeletingOrder[0].startAfter,
                endedAt: responseOfDeletingOrder[0].endedAt,
                status: "CANCEL",
            }).returning({
                historyId: history_schema_1.HistoryTable.id,
                historyStatus: history_schema_1.HistoryTable.status,
            });
            if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
                throw exceptions_1.ClientCreateHistoryException;
            }
            return {
                ...responseOfCreatingHistory,
            };
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], OrderService);
//# sourceMappingURL=order.service.js.map