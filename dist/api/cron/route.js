"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.GET = GET;
const serverless_1 = require("@neondatabase/serverless");
require("dotenv/config");
exports.dynamic = 'force-dynamic';
async function getData() {
    const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
    const response = await sql `SELECT version()`;
    return response[0].version;
}
function GET(request) {
    return new Response(`result from neon: ${getData()}`, {
        status: 200,
    });
}
//# sourceMappingURL=route.js.map