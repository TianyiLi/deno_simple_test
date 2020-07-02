import { Database, Model } from "https://deno.land/x/denodb/mod.ts";

class DatabaseService {
  db: Database;
  registerList = new Set<typeof Model>();
  constructor() {
    this.db = new Database(
      { dialect: "mysql", debug: true },
      {
        database: "bill",
        host: "192.168.72.128",
        username: "root",
        password: "root",
        port: 3300,
      },
    );
  }

  async sync() {
    this.db.link([...this.registerList]);
    await this.db.sync({ drop: true });
  }
}
export default new DatabaseService();
