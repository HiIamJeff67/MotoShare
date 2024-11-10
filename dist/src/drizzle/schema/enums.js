"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postedStatusEnum = exports.orderStatusEnum = exports.inviteStatusEnum = exports.historyStatusEnum = exports.starRatingEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.starRatingEnum = (0, pg_core_1.pgEnum)("starRating", ["0", "1", "2", "3", "4", "5"]);
exports.historyStatusEnum = (0, pg_core_1.pgEnum)("historyStatus", ["FINISHED", "EXPIRED", "CANCEL"]);
exports.inviteStatusEnum = (0, pg_core_1.pgEnum)("inviteStatus", ["ACCEPTED", "REJECTED", "CHECKING", "CANCEL"]);
exports.orderStatusEnum = (0, pg_core_1.pgEnum)("orderStatus", ["UNSTARTED", "STARTED"]);
exports.postedStatusEnum = (0, pg_core_1.pgEnum)("postStatus", ["POSTED", "EXPIRED", "CANCEL"]);
//# sourceMappingURL=enums.js.map