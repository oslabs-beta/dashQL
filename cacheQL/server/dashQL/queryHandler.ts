//const redisdb = require('../redis');
import redisdb from '../redis';
//const { parse } = require('graphql/language/parser');
import { parse } from 'graphql/language/parser';
// const dash = require('./dashCache');
import dash from './dashCache';

async function queryHandler(req: any, res: any, next: any) {
  //get query from request body
  // console.log('--------LOGGING REQ.BODY.QUERY---------');
  //console.log(req.body.query);
  const query = req.body.query;
  //parse query
  const parsedQuery: any = parse(query);
  console.log('--------LOGGING PARSED QUERY to FIELD LEVEL------------');

  // const parsedFields =
  //   parsedQuery.definitions[0].selectionSet.selections[0].selectionSet
  //     .selections;
  //const type = parsedQuery.definitions[0].selectionSet.selections[0].name.value;
  //console.log(type);
  //console.log(parsedFields);

  const queryString = JSON.stringify(query);
  // console.log(queryString);
  //  console.log(typeof queryString);
  //start time
  const startTime = performance.now();

  const exists = await redisdb.exists(queryString);

  let hitPercentage: number;

  //check if string key in is redis.
  if (exists >= 1) {
    const cacheResponse = await redisdb.get(queryString);
    console.log('cache response', cacheResponse);
    res.locals.res = cacheResponse;
    res.locals.cacheHit = true;
    hitPercentage = 1;
  } else {
    const dashCaches = new dash(parsedQuery, redisdb); //-> consider also passing response
    const responseFromdashCache = await dashCaches.cacheHandler(query);
    console.log(responseFromdashCache);
    res.locals.res = JSON.stringify(responseFromdashCache);
    hitPercentage = dashCaches.totalHits / dashCaches.mapLength;
  }
  res.locals.hitPercentage = hitPercentage;
  res.locals.missPercentage = 1 - hitPercentage;

  console.log('res.locals', res.locals.res);
  //end time
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  console.log('logging total time', totalTime);

  //res.locals - response and response time
  res.locals.time = totalTime;
  //console.log(res.locals);

  return next();
}

// module.exports = queryHandler;
export default queryHandler;
