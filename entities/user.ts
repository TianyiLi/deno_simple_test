export interface IUser {
  id: number;
  name: string;
  password: string;
  info: null | unknown;
}

export interface IActivity {
  id: number;
  name: string;
}

export interface IUserActivity {
  id: number;
  activity_id: IActivity["id"];
  user_id: IUser["id"];
  occurrence: number;
}
