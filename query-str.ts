import { Client } from "https://deno.land/x/mysql/mod.ts";
import { ExecuteResult } from "https://deno.land/x/mysql/src/connection.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { IUser } from "./entities/user.ts";
const salt = bcrypt.genSaltSync(10);

interface IQuery<T> extends ExecuteResult {
  rows: T[];
}

type TSignup = {
  username: string;
  password: string;
};

export function signup(params: TSignup) {
  return async (cli: Client) => {
    await cli.execute(
      `
    INSERT INTO \`users\`(\`name\`, \`password\`) VALUES (?,?);
    `,
      [params.username, bcrypt.hashSync(params.password, salt)],
    );
    return true;
  };
}

export function signin({ username, password }: TSignup) {
  return async (cli: Client) => {
    try {
      const result = (await cli.execute(
        `
        select name, password, info
        from users
        where name=?
      `,
        [username],
      )) as IQuery<IUser>;
      console.log(result);
      const user = result.rows[0];
      return bcrypt.compareSync(password, user.password) ? user : false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export function updateUserInfo(id: IUser["id"], info: string) {
  return async (cli: Client) => {
    await cli.execute(
      `
    update users
    set info=?
    where id=?
    `,
      [info, id],
    );
  };
}

interface IReport extends ExecuteResult {
  rows: {
    activity_name: number;
    user_name: number;
    first_occurrence: number;
    last_occurrenct: number;
    amount: number;
  }[];
}

export function getActivityReport() {
  return async (cli: Client) => {
    const result = (await cli.execute(`
  SELECT a.name AS activity_name,
    u.name AS user_name,
    MIN(au.occurrence) AS first_occurrence,
    MAX(au.occurrence) AS last_occurrence,
    COUNT(*) AS amount
  FROM users AS u
    JOIN activity_user AS au ON au.activity_id = u.id
    JOIN activity AS a ON a.id = au.activity_id
  WHERE MONTH(au.occurrence) = 10
  GROUP BY user_id,
    activity_id
    `)) as IReport;
    return result;
  };
}

export function getActivity() {
  return async (cli: Client) => {
    const result = (await cli.query(`select id, name from activity`)) as {
      id: number;
      name: string;
    }[];
    return result;
  };
}
