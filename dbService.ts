import { Client } from "https://deno.land/x/mysql/mod.ts";
const client = await new Client().connect({
  db: 'bill',
  hostname: 'localhost',
  username: 'root',
  password: 'root',
  port: 3306,
});

export default client;