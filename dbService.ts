import { Client } from "https://deno.land/x/mysql/mod.ts";
import { DB_NAME, DB_HOST, USER_NAME, PASSWORD, DB_PORT } from "./constant.ts";

const client = await new Client().connect({
  db: DB_NAME,
  hostname: DB_HOST,
  username: USER_NAME,
  password: PASSWORD,
  port: +DB_PORT,
});

export default client;
