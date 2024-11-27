"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.default = handler;
const serverless_1 = require("@neondatabase/serverless");
require("dotenv/config");
exports.dynamic = 'force-dynamic';
async function getData() {
    const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
    const response = await sql `SELECT version()`;
    return response[0].version;
}
function handler(request, response) {
    response.status(200).json({ success: true, context: "Hello Vercel Cron", data: getData() });
}
//# sourceMappingURL=route.js.map