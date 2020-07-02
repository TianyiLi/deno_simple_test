import { Router, Status, Response } from "https://deno.land/x/oak/mod.ts";
import client from "./dbService.ts";
import { getActivityReport, signin, signup } from "./query-str.ts";

const router = new Router();

router.get("/api/report", async ({ response }) => {
  const result = await getActivityReport()(client);
  response.body = result.rows;
  response.status = 200;
  return;
});

function inValidResponse(response: Response) {
  response.body = JSON.stringify({ message: "Invalid Parameters" });
  response.status = Status.BadRequest;
  return;
}

router.post("/api/signin", async ({ response, request }) => {
  const { type, value } = await request.body();
  if (type !== "json") {
    response.status = Status.Unauthorized;
    response.body = JSON.stringify({ message: "Unauthorized" });
    return;
  }
  const result = await signin(value)(client);
  if (!result) {
    response.status = Status.Unauthorized;
    response.body = JSON.stringify({ message: "Unauthorized" });
    return;
  }
  response.status = Status.OK;
  response.body = JSON.stringify(result);
  return;
});

router.post("/api/signup", async ({ request, response }) => {
  const { type, value } = await request.body();
  if (type !== "json") {
    inValidResponse(response);
    return;
  }
  const result = await signup(value)(client);
  if (result) {
    response.status = Status.OK;
    response.body = "{}";
    return;
  }
  response.body = JSON.stringify({ message: "name repeat" });
  response.status = Status.Conflict;
  return;
});

router.post("/api/update-auth", async ({ request, response }) => {
  const auth = request.headers.get("authorization");
  const { value, type } = await request.body();
  console.log(auth);
});

export { router };
