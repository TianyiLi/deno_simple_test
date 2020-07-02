import { config } from "https://deno.land/x/dotenv/mod.ts";

export const {
  DB_NAME,
  DB_HOST,
  DB_PORT,
  USER_NAME,
  PASSWORD,
  SERVER_PORT,
  JWT_SECRET,
} = config();
