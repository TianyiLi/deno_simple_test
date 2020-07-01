import { Database } from 'https://deno.land/x/denodb/mod.ts'
import { UserActivity } from '../db-model/user-activity.ts'
import { User } from '../db-model/user.ts'
import { Activity } from '../db-model/activity.ts'

type TList = {
  user_name: string
  activity_name: string
  amount: number
  first_occurrence: string
  last_occurrence: string
}

export class UserActivityService {
  static model = UserActivity

  static async getWholeListByMonth(month: number) {
    UserActivity.join(User, User.field('id'), UserActivity.field('user_id'))
      .join(Activity, Activity.field('id'), UserActivity.field('user_id'))
      .select(
        User.field('name', 'user_name'),
        Activity.field('name', 'activity_name'),
        UserActivity.field('created_at', 'first_occurrence'),
        UserActivity.field('updated_at', 'last_occurrence')
      )
      .groupBy(User.field('name'))
  }
}
