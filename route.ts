import { Router } from 'https://deno.land/x/oak/mod.ts';
import client from './dbService.ts';
import { getActivityReport, userAuth } from './query-str.ts';

const router = new Router();

router.post('/auth', async ({ request, response }) => {
  const { type, value } = await request.body();
  if (type !== 'json') {
    response.status = 423;
    return;
  }
  const users = await userAuth(value.name, value.password)(client);
  response.body = JSON.stringify({ state: users });
  response.status = 200;
  return;
});

router.get('/report', async ({ response }) => {
  const result = await getActivityReport()(client);
  response.body = result.rows;
  response.status = 200;
  return;
});

export { router };
