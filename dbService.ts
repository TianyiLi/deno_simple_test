import { Client } from "https://deno.land/x/mysql/mod.ts";
const client = await new Client().connect({
  db: 'bill',
  hostname: '192.168.72.128',
  username: 'root',
  password: 'root',
  port: 3300,
});

export default client;