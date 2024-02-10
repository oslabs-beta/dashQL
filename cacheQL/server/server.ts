/* eslint-disable @typescript-eslint/no-var-requires */
// import * as express from 'express';
const express = require('express');
// import * as path from 'path';
// const { Request, Response, NextFunction, RequestHandler } = require('@types/express');

const path = require('path');

const redisTest = require('./redis');

const cors = require('cors');
//import queryRouter from './routers/queryRouter';
// import { schema } from './Schemas/schema';
const { schema } = require('./Schemas/schema');
const { createHandler } = require('graphql-http/lib/use/express');
// import { createHandler } from 'graphql-http/lib/use/express';
const dashQL = require('./dashQL/queryHandler');

const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/dashQL', dashQL, (_req: any, res: any) => {
  return res.status(200).send('End of route');
});

app.use(
  '/api/query',
  createHandler({
    schema,
    context: (req: any) => ({
      req,
    }),
  })
);

app.get('/redis', async (req: any, res: any) => {
  console.log(req);
  const response = await redisTest.getset('Hello');
  console.log(response);
  return res.status(200).send(response);
});

//app.use('/graphql', createHandler({ schema }));
//app.use('/api/query', queryRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
// export default app;
module.exports = app;
