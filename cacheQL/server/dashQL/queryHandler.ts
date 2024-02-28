import redisdb from '../redis';
import { parse } from 'graphql/language/parser';
import dash from './dashCache';

async function queryHandler(req: any, res: any, next: any) {
  const query = req.body.query;
  //parse query
  const parsedQuery: any = parse(query);
  //start time
  const startTime = performance.now();
  console.log('parsed query', parsedQuery)

  const dashCaches = new dash(parsedQuery, redisdb);
  const responseFromdashCache = await dashCaches.cacheHandler();

  //attached responses from dashCache to res.locals
  const hitPercentage = dashCaches.totalHits / dashCaches.mapLength;
  console.log('RESPONSE FROM DASHCACHE', responseFromdashCache, typeof responseFromdashCache)
  res.locals.res = typeof responseFromdashCache === 'string' ? responseFromdashCache : JSON.stringify(responseFromdashCache);
  console.log('after stringiy', res.locals.res)
  res.locals.hitPercentage = hitPercentage;
  res.locals.missPercentage = 1 - hitPercentage;
  res.locals.cacheHit = hitPercentage === 1;
  res.locals.totalHits = dashCaches.totalHits;
  res.locals.totalQueries = dashCaches.mapLength;

  console.log('res.locals', res.locals.res);
  //end time
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  console.log('logging total time', totalTime);

  res.locals.time = totalTime;

  return next();
}

export default queryHandler;
