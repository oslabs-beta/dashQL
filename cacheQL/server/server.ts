/* eslint-disable @typescript-eslint/no-var-requires */
import * as express from 'express';
import { parse } from 'graphql/language/parser';
import * as path from 'path';
import redisTest from './redis.ts';
import * as cors from 'cors';
import schema from './Schemas/schema';
import { createHandler } from 'graphql-http/lib/use/express';
import dashQL from './dashQL/queryHandler';

const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../client")));

app.use("/dashQL", dashQL, (_req: any, res: any) => {
  return res.status(200).json(res.locals);
});

app.use(
  "/api/query",
  createHandler({
    schema,
  })
);


app.use('/test', (req, res) => {
  const parsedQuery: any = parse(req.body.query);
  console.log(
    'logging parsed query: ',
    parsedQuery.definitions[0].selectionSet.selections[0].selectionSet
      .selections[2]
  );
  return res.status(200).send('test');
});

app.use('/clearCache', (_req, res) => {
  redisTest.FLUSHDB();
  return res.status(200).send("Cache cleared");
});

app.get("/redis", async (req: any, res: any) => {
  console.log(req);
  const response = await redisTest.get("Hello");
  console.log(response);
  return res.status(200).send(response);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
