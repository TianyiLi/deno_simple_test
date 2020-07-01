import { Client } from 'https://deno.land/x/mysql/mod.ts';
import { ExecuteResult } from 'https://deno.land/x/mysql/src/connection.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

export function userAuth(name: string, password: string) {
  return async (cli: Client) => {
    const hashPassword: string = await cli.query(
      `select password from users where name = ?`,
      [name]
    );
    const result = bcrypt.compareSync(password, hashPassword);
    return result;
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
    return result
  };
}
