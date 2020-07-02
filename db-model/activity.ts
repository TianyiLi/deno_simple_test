import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export type TActivityBase = {
  id: number;
  name: string;
};

export class Activity extends Model {
  static table = "activity";
  static timestamp = true;
  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
  } as typeof Model["fields"];
}
