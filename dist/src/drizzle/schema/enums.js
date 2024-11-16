"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postedStatusEnum = exports.ridderOrderStatusEnum = exports.passengerOrderStatusEnum = exports.inviteStatusEnum = exports.historyStatusEnum = exports.starRatingEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.starRatingEnum = (0, pg_core_1.pgEnum)("starRating", ["0", "1", "2", "3", "4", "5"]);
exports.historyStatusEnum = (0, pg_core_1.pgEnum)("historyStatus", ["FINISHED", "EXPIRED", "CANCEL"]);
exports.inviteStatusEnum = (0, pg_core_1.pgEnum)("inviteStatus", ["ACCEPTED", "REJECTED", "CHECKING", "CANCEL"]);
exports.passengerOrderStatusEnum = (0, pg_core_1.pgEnum)("passengerOrderStatus", ["UNSTARTED", "STARTED", "UNPAID", "FINISHED"]);
exports.ridderOrderStatusEnum = (0, pg_core_1.pgEnum)("ridderOrderStatus", ["UNSTARTED", "STARTED", "UNPAID", "FINISHED"]);
exports.postedStatusEnum = (0, pg_core_1.pgEnum)("postStatus", ["POSTED", "EXPIRED", "CANCEL", "RESERVED"]);
//# sourceMappingURL=enums.js.map