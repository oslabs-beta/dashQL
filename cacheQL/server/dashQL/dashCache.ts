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

  Tuesday to do:
  1. breakup query string - loop through parsed query
  2. add individual queries to cache
  3. assume second query is subset of first
  4. breakup query string


    const type = parsedQuery.definitions[0].selectionSet.selections[0].name.value

              
  // MAP
    {
      {
      "People" : {
        fields: mass
        _id: 1
      }"} : "77"
      "mass _id: 1": "77" || null
    }  
  5. query for individual fields - if not in cache add
  6. build response



data[type][fieldName] = fieldVal
*/
  async cacheHandler(rawQuery: string) {
    // invoke isCacheEmpty
    const cacheEmpty = await this.isCacheEmpty();
    // if cache is empty:
    //TO BE UPDATED ONCE QUERY IS BROKEN DOWN INTO SMALLER PIECES
    if (cacheEmpty /*|| !cacheEmpty */) {
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
    else {
      const splitQuery = this.splitQuery();
      //console.log('logging splitQuery:', splitQuery);
      await this.checkQueries(splitQuery);
      // we want to do some logic to determine whether this needs to be called
      this.buildSubGraphQLQuery(splitQuery);
    }
  }

  //BREAK QUERY INTO INDIVIDUAL FIELD LEVEL QUERIES
  splitQuery() {
    // create object to store individual fields
    const keyMap = new Map();
    // have to make anyQuery bc typescript is annoying
    const anyQuery: any = this.query;
    // array of all types
    const typesArr = anyQuery.definitions[0].selectionSet.selections;
    //console.log(typesArr[0].arguments);
    //  iterate through selections arr {
    for (let i = 0; i < typesArr.length; i++) {
      const fieldsArr = typesArr[i].selectionSet.selections;
      //    iterate through fields arr
      for (let j = 0; j < fieldsArr.length; j++) {
        //    add each field as a key to the map
        const keyObj = {
          //    added a "type" property so we don't have to use Object.keys later
          type: typesArr[i].name.value,
          args: typesArr[i].arguments,
          field: fieldsArr[j].name.value,
        };
        // ASK MEREDITH FOR THOUGHTS ON THIS:
        // we could just check the cache for this keyObj right here
        // and assign the result of that to the value in the map,
        // rather than doing it in a separate method

        // put keyObj in map
        keyMap.set(keyObj, null);
      }
    }
    return keyMap;
  }

  //Loop through map and check to see if in cache

  //TO UPDATE ANY ANY TO CREATE AN INTERFACE
  async checkQueries(map: Map<any, any>) {
    for (let [key, _value] of map) {
      //console.log('individual key', key);
      let stringifyKey: string = JSON.stringify(key);
      let cacheResponse = await this.checkRedis(stringifyKey);
      if (cacheResponse === null) {
        //build query to get from database
        console.log('-----------ENTERING IF-------------');

        //TO REMOVE AFTER TESTING _ FOR TESTING ONLY
        await this.redisdb.set(stringifyKey, 'test');
      } else {
        //return response
        //console.log('line 115', value);
        console.log('array key?', key);
        map.set(key, cacheResponse);
        console.log('-----------ENTERING ELSE-------------');
        console.log(cacheResponse);
      }
    }
    console.log('updated map', map);
  }

  buildSubGraphQLQuery(map: Map<any, any>) {
    const queryArr: any[] = [];

    for (let [key, value] of map) {
      if (value === null) {
        queryArr.push(key);
      }
    }
    console.log('logging queryArr: ', queryArr);

    let type = '';
    let arg = '';
    let fields = '';
    if (queryArr.length > 0) {
      // probably wanna change this part when we add functionality
      // for accepting multiple types
      type += queryArr[0].type;
      queryArr[0].args.forEach((el: any) => {
        arg += el.name.value + ': ' + el.value.value + ', ';
      });

      for (let i = 0; i < queryArr.length; i++) {
        fields += queryArr[i].field + ', ';
      }
    }
    //iterate through queryArr
    /* 
    query {
      people (id: x) {
        field1
        field2
      }
      planet(id: y){
        field1
        field2
      }
    } 
    */
    let query = `query {  ${type} (${arg}) { ${fields}}`;
    console.log(query);
    return query;
  }

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




  get / check redis method
   */
  async checkRedis(key: any) {
    if (this.redisdb.get(key) !== null) {
      //return response
      return await this.redisdb.get(key);
    } else {
      return null;
    }
  }
}
export default dashCache;
