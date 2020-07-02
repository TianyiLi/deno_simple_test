import {
  Router,
  Status,
  Response,
  HttpError,
  helpers,
} from 'https://deno.land/x/oak/mod.ts';
import client from './dbService.ts';
import {
  getActivityReport,
  signin,
  signup,
  updateUserInfo,
  getActivity,
  nameVerify,
  getUserInfo,
  createActivity,
  addUserActivity,
} from './query-str.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import {
  makeJwt,
  setExpiration,
  Payload,
} from 'https://deno.land/x/djwt/create.ts';
import { JWT_SECRET } from './constant.ts';

const router = new Router();

const payload: Payload = {
  iss: '',
};

async function jwtValidate(token?: string) {
  const result = await validateJwt(token || '', JWT_SECRET);
  if (!result.isValid) {
    const error = new HttpError('jwt incorrect');
    error.status = Status.Unauthorized;
    throw error;
  }
  return result;
}

function inValidResponse(response: Response) {
  response.body = JSON.stringify({ message: 'Invalid Parameters' });
  response.status = Status.BadRequest;
  return;
}

router
  .get('/api/report', async ({ response }) => {
    const result = await getActivityReport()(client);
    response.body = result.rows;
    response.status = 200;
    return;
  })
  .post('/api/signin', async ({ response, request }) => {
    const { type, value } = await request.body();
    if (type !== 'json') {
      response.status = Status.Unauthorized;
      response.body = JSON.stringify({ message: 'Unauthorized' });
      return;
    }
    const result = await signin(value)(client);
    if (!result) {
      response.status = Status.Unauthorized;
      response.body = JSON.stringify({ message: 'Unauthorized' });
      return;
    }
    const jwt = makeJwt({
      key: JWT_SECRET,
      header: {
        alg: 'HS256',
        typ: 'JWT',
      },
      payload: {
        iss: result.username,
        exp: setExpiration(Date.now() + 60 * 24 * 1000),
      },
    });
    response.status = Status.OK;
    response.body = JSON.stringify({ data: { ...result, token: jwt } });
    return;
  })
  .post('/api/signup', async ({ request, response }) => {
    const { type, value } = await request.body();
    if (type !== 'json') {
      inValidResponse(response);
      return;
    }
    const result = await signup(value)(client);
    if (result) {
      response.status = Status.OK;
      response.body = JSON.stringify({ message: 'success' });
      return;
    }
    response.body = JSON.stringify({ message: 'name repeat' });
    response.status = Status.Conflict;
    return;
  })
  .put('/api/user/:id/info', async ({ request, response, params }) => {
    const id = params.id!
    const auth = request.headers
      .get('authorization')
      ?.replace(/^Bearer\s+/, '');
    log.debug(auth);

    const { payload } = await jwtValidate(auth);
    const { value, type } = await request.body();
    if (type !== 'json') {
      inValidResponse(response);
      return;
    }
    log.debug(payload);
    await updateUserInfo(+id, value.info)(client);
    response.body = JSON.stringify({ message: 'success' });
    return;
  })
  .get('/api/activity/all', async ({ response }) => {
    const result = await getActivity()(client);
    response.body = JSON.stringify({ data: result });
    response.status = Status.OK;
    return;
  })
  .post('/api/activity', async (ctx) => {
    const query = helpers.getQuery(ctx);
    await createActivity(query.name)(client);
    ctx.response.body = { message: 'success' };
    ctx.response.status = Status.OK;
    return;
  })
  .get('/api/user', async (ctx) => {
    const query = helpers.getQuery(ctx);
    log.debug(ctx);
    const result = await nameVerify(query.name)(client);
    ctx.response.body = JSON.stringify({ data: result });
    ctx.response.status = Status.OK;
    return;
  })
  .get('/api/user/:id/info', async ({ params, response }) => {
    const result = await getUserInfo(+params.id!)(client);
    response.body = JSON.stringify({ data: result });
    response.status = Status.OK;
    return;
  })
  .post('/api/user/:id/activity/:aId', async ({ params, response }) => {
    const { id, aId } = params;
    await addUserActivity(+id!, +aId!)(client);
    response.body = JSON.stringify({ message: 'success' });
    response.status = Status.OK;
    return;
  });

export { router };
