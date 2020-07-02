import { Database } from "https://deno.land/x/denodb/mod.ts";
import { User, TUserBase } from "../db-model/user.ts";

export class UserService {
  static model = User;

  static async getUser(id: number) {
    const user: TUserBase = await User.select("id", "name", "information")
      .where({ id })
      .get();
    return user;
  }

  static async getAllUsers() {
    const user: TUserBase[] = await User.select(
      "id",
      "name",
      "information",
    ).all();
    return user;
  }
}
