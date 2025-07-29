import Koa from "koa";
const app = new Koa();
import Router from "koa-router";
import fs from "node:fs";

export const router = new Router();

router.get("/api/chartdata", (ctx, next) => {
  try {
    const data = fs.readFileSync("../multline_chart.json", "utf8");
    console.log(`NodeJs-koa: returning chart data`);
    ctx.body = data;
  } catch (err) {
    console.error(err);
  }
});

app.use(router.routes());

app.listen(3000);
