import { Database, Model } from "https://deno.land/x/denodb/mod.ts";
import { DB_NAME, DB_HOST, USER_NAME, PASSWORD, DB_PORT } from "./constant";

class DatabaseService {
  db: Database;
  registerList = new Set<typeof Model>();
  constructor() {
    this.db = new Database(
      { dialect: "mysql", debug: true },
      {
        database: DB_NAME,
        host: DB_HOST,
        username: USER_NAME,
        password: PASSWORD,
        port: DB_PORT,
      },
    );
  }

  async sync() {
    this.db.link([...this.registerList]);
    await this.db.sync({ drop: true });
  }
}
export default new DatabaseService();
