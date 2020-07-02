import {
  Application,
  isHttpError,
  Status,
} from "https://deno.land/x/oak/mod.ts";

import { router } from "./route.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (isHttpError(error)) {
      switch (error.status) {
        case Status.NotFound:
          ctx.response.status = Status.NotFound;
          ctx.response.body = JSON.stringify({ message: "page not found" });
          break;
      }
    }
    console.error(error);
    ctx.response.status = error.status;
    ctx.response.body = JSON.stringify({ message: error.message });
    throw error;
  }
});

console.log(`app listen on ${"127.0.0.1"}:${8999}`);
await app.listen(`127.0.0.1:8999`);
