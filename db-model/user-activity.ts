import {
  Model,
  Relationships,
} from "https://deno.land/x/denodb/mod.ts";
import { Activity } from "./activity.ts";
import { User } from "./user.ts";

export type TUserActivityBase = {
  id: number;
  activity_id: number;
  user_id: number;
};

export class UserActivity extends Model {
  static table = "user_activity";
  static timestamp = true;
  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    activity_id: Relationships.belongsTo(Activity),
    user_id: Relationships.belongsTo(User),
  } as typeof Model["fields"];

  static user() {
    return this.hasOne(User);
  }

  static activity() {
    return this.hasOne(Activity);
  }
}
