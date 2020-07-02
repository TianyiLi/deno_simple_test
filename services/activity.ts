import { Database } from "https://deno.land/x/denodb/mod.ts";
import { Activity } from "../db-model/activity.ts";

export class ActivityService {
  static model = Activity;

  static async addActivity(name: string) {
    await this.addActivities([name]);
  }

  static async addActivities(name: string[]) {
    await Activity.create(name.map((n) => ({ name: n })));
  }

  static async getAllActivities() {
    return await Activity.select("id", "name").all();
  }
}
