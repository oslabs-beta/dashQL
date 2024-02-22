import redisdb from '../redis';
import { parse } from 'graphql/language/parser';
import dash from './dashCache';

async function queryHandler(req: any, res: any, next: any) {
  const query = req.body.query;
  //parse query
  const parsedQuery: any = parse(query);
  const queryString = JSON.stringify(query);
  //start time
  const startTime = performance.now();
  console.log('parsed query', parsedQuery)

  const exists = await redisdb.exists(queryString);

  let hitPercentage: number;
  let totalHits: number;
  let mapLength: number;

  //check if string key in is redis.
  if (exists >= 1) {
    const cacheResponse = await redisdb.get(queryString);
    console.log('cache response', cacheResponse);
    res.locals.res = cacheResponse;

    hitPercentage = 1;
    totalHits = 0;
    mapLength = 0;
  } else {
    const dashCaches = new dash(parsedQuery, redisdb);
    const responseFromdashCache = await dashCaches.cacheHandler(query);
    console.log(responseFromdashCache);
    res.locals.res = JSON.stringify(responseFromdashCache);
    hitPercentage = dashCaches.totalHits / dashCaches.mapLength;
    totalHits = dashCaches.totalHits;
    mapLength = dashCaches.mapLength;
  }
  res.locals.hitPercentage = hitPercentage;
  res.locals.missPercentage = 1 - hitPercentage;
  res.locals.cacheHit = hitPercentage === 1;
  res.locals.totalHits = totalHits;
  res.locals.totalQueries = mapLength;

  console.log('res.locals', res.locals.res);
  //end time
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  console.log('logging total time', totalTime);

  //res.locals - response and response time
  res.locals.time = totalTime;

  return next();
}

export default queryHandler;
