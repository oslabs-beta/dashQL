import { DashCache } from '../types/types';

class dashCache {
  query: Document;
  redisdb: any;
  response: any;
  constructor(parsedQuery, redisdb, response?) {
    this.query = parsedQuery;
    this.redisdb = redisdb;
    this.response;
  }

  /*

  check redis method
    
        //if true invoke get method

        //if false do a lot of other stuff
//

*/
  cacheHandler(rawQuery: string) {
    //SET WHOLE STRING IN THE CACHE
  }

  /*
//we know whole string is not in data base.
//get from database -> request to route api/query sending query string in body
//store key value pair on cache -> redis.set('key'), 'value'




  get redis method
   */
}
