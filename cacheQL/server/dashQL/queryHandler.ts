import { parse } from 'graphql/language/parser';
import dash from './dashCache';
// const redisBase = require('redis');
class queryHandler {
  redis: any;
  constructor(redis: any) {
    this.redis = redis;
    this.handleQueries = this.handleQueries.bind(this);
  }

  async handleQueries(req: any, res: any, next: any) {
    const query = req.body.query;
    //parse query
    const parsedQuery: any = parse(query);
    //start time
    const startTime = performance.now();
    const dashCaches = new dash(parsedQuery, this.redis);
    const responseFromdashCache = await dashCaches.cacheHandler();

    //attached responses from dashCache to res.locals
    const hitPercentage = dashCaches.totalHits / dashCaches.mapLength;
    res.locals.res = JSON.stringify(responseFromdashCache);
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
}

export default queryHandler;
