import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from "@neondatabase/serverless";
import { Request } from "express";
import "dotenv/config"

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

async function getData() {
    const sql = neon(process.env.DATABASE_URL as string);
    const response = await sql`SELECT version()`;
    return response[0].version;
}
 
export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json({ success: true, context: "Hello Vercel Cron", data: getData() });
}