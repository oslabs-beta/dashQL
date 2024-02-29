
import express from "express";
import { parse } from "graphql/language/parser";
import path from "path";
// import redisTest from './redis.ts';
import cors from "cors";

import schema from "./Schemas/schema";
import { createHandler } from "graphql-http/lib/use/express";
const redisBase = require("redis");
// import redisBase from 'redis';
import dashQL from "./dashQL/queryHandler";

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../client")));
const redis = redisBase.createClient({
  password: "tqVEk7pRA8dgdiwUjOGzCvTJjfK2YFMt",
  socket: {
    host: "redis-12168.c321.us-east-1-2.ec2.cloud.redislabs.com",
    port: 12168,
  },
});
(async () => {
  console.log("Connecting to Redis...");
  redis.on("error", (error: string) => console.error(`Ups : ${error}`));
  await redis.connect();
})();

const queryHandler = new dashQL(redis);
const handleQueries = queryHandler.handleQueries;

app.use("/dashQL", handleQueries, (_req: any, res: any) => {
  return res.status(200).json(res.locals);
});

app.use(
  "/api/query",
  createHandler({
    schema,
  })
);

app.use("/test", (req, res) => {
  const parsedQuery: any = parse(req.body.query);
  console.log(
    "logging parsed query: ",
    parsedQuery.definitions[0].selectionSet.selections[0].selectionSet
      .selections[2]
  );
  return res.status(200).send("test");
});

app.use("/clearCache", (_req, res) => {
  redis.FLUSHDB();
  return res.status(200).send("Cache cleared");
});

// app.get('/redis', async (req: any, res: any) => {
//   console.log(req);
//   const response = await redisTest.get('Hello');
//   console.log(response);
//   return res.status(200).send(response);
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
