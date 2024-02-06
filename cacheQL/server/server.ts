// import * as express from 'express';
const express = require('express');
// import * as path from 'path';
const path = require('path');
//import queryRouter from './routers/queryRouter';
// import { schema } from './Schemas/schema';
const {schema} = require('./Schemas/schema')
const { createHandler } = require('graphql-http/lib/use/express');
// import { createHandler } from 'graphql-http/lib/use/express';

const app = express();
const PORT = 5001;
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/api/query', createHandler({ schema }));


//app.use('/graphql', createHandler({ schema }));
//app.use('/api/query', queryRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
// export default app;
module.exports = app;
