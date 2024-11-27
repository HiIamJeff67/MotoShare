import { neon } from "@neondatabase/serverless";
import "dotenv/config"

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

async function getData() {
    const sql = neon(process.env.DATABASE_URL as string);
    const response = await sql`SELECT version()`;
    return response[0].version;
}
 
export function GET(request: Request) {
  return new Response(`result from neon: ${getData()}`, {
    status: 200, 
  });
}
