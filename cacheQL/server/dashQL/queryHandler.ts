//const redisdb = require('../redis');
import redisdb from '../redis';
//const { parse } = require('graphql/language/parser');
import { parse } from 'graphql/language/parser';
// const dash = require('./dashCache');

async function queryHandler(req: any, res: any, next: any) {
  //get query from request body
  console.log('--------LOGGING REQ.BODY.QUERY---------');
  console.log(req.body.query);
  const query = req.body.query;
  //parse query
  const parsedQuery = parse(query);
  // console.log('--------LOGGING PARSED QUERY------------');
  console.log(parsedQuery.definitions[0]);

  const queryString = JSON.stringify(query);
  console.log(queryString);
  console.log(typeof queryString);
  //start time
  const startTime = performance.now();
  console.log(startTime);

  const exists = await redisdb.exists(queryString);

  //check if string key in is redis.
  if (exists >= 1) {
    res.locals.res = await redisdb.get(queryString);
  } else {
    //const dashCaches = new dash(parsedQuery, redisdb); //-> consider also passing response
    // dashCaches.cacheHandler(queryString)
    //if not send to dashCache
    //create new instatnace of dashCache with parsed query
  }

  console.log(res.locals.res);
  //end time

  //res.locals - response and response time

  return next();
}

// module.exports = queryHandler;
export default queryHandler;
