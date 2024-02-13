// import { DashCache } from '../types/types';
import { DocumentNode } from 'graphql';

class dashCache {
  query: DocumentNode;
  redisdb: any;
  response: any;
  constructor(parsedQuery: DocumentNode, redisdb: any, response?: any) {
    this.query = parsedQuery;
    this.redisdb = redisdb;
    this.response = response;
  }

  /*

  check redis method
    
        //if true invoke get method

        //if false do a lot of other stuff
//

*/
  async cacheHandler(rawQuery: string) {
    // invoke isCacheEmpty
    const cacheEmpty = await this.isCacheEmpty();
    // if cache is empty:
    //TO BE UPDATED ONCE QUERY IS BROKEN DOWN INTO SMALLER PIECES
    if (cacheEmpty || !cacheEmpty) {
      //  invoke queryToDB(raw query)

      const responseFromDB = await this.queryToDB(rawQuery);
      //  set key/value pair in cache with query string and query response
      console.log('logging typeof response', typeof responseFromDB);
      this.redisdb.set(
        JSON.stringify(rawQuery),
        JSON.stringify(responseFromDB)
      );
      //  return out of function with response from server
      return responseFromDB;
    }
    //if cache is not empty
    //    split up query into individual fields

  }

  //BREAK QUERY INTO INDIVIDUAL FIELD LEVEL QUERIES


  async isCacheEmpty() {
    // invoke redisdb.DBSIZE to check whether cache is empty
    // return true if empty, false if not
    const dbSize = await this.redisdb.DBSIZE();
    console.log('in isCacheEmpty');
    console.log(dbSize);
    if (dbSize === 0) {
      return true;
    } else {
      return false;
    }
  }

  async queryToDB(query: string) {
    console.log('logging query argument ', JSON.stringify(query));
    const bodyObj = { query: query };
    // make request to server (/api/query) with entire query string
    const jsonDBRes = await fetch('http://localhost:5001/api/query', {
      //to confirm using POST method
      method: 'POST',
      body: JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log(jsonDBRes, typeof jsonDBRes);
    const dbRes = jsonDBRes.json();

    // const response from db = server responds with query response using data from db
    console.log('logging dbresponse', dbRes);

    // return response from db
    return dbRes;
  }
  /*
//we know whole string is not in data base.
//get from database -> request to route api/query sending query string in body
//store key value pair on cache -> redis.set('key'), 'value'




  get redis method
   */
}
export default dashCache;
