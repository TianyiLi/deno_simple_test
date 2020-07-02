import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export type TUserBase = {
  id: number;
  name: string;
  information: string;
};

export class User extends Model {
  static table = "users";
  static timestamp = true;
  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    information: DataTypes.TEXT,
  };
}
