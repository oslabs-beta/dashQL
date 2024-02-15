// import { DashCache } from '../types/types';
import { DocumentNode } from 'graphql';
// import { parse } from 'graphql/language/parser';

class dashCache {
  query: DocumentNode;
  redisdb: any;
  response: any;
  responseReady: boolean;
  totalHits: number;
  mapLength: number;
  constructor(parsedQuery: DocumentNode, redisdb: any, response?: any) {
    this.query = parsedQuery;
    this.redisdb = redisdb;
    this.response = response;
    this.responseReady = false;
    this.totalHits = 0;
    this.mapLength = 0;
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
    // ADD LOGIC TO DETERMINE WHETHER QUERY RESPONSE IS COMPLETE
    // AFTER GETTING INFO FROM THE CACHE
    else {
      const splitQuery = this.splitQuery();
      //console.log('logging splitQuery:', splitQuery);
      //populate map with keys
      await this.checkQueries(splitQuery);
      // we want to do some logic to determine whether this needs to be called
      this.responseReady = this.isResponseReady(splitQuery);
      if (this.responseReady) {
        return this.maptoGQLResponse(splitQuery);
      } else {
        const subGQLQuery = this.buildSubGraphQLQuery(splitQuery);
        const subQueryResponse = await this.queryToDB(subGQLQuery);
        //console.log(subQueryResponse)
        const responseToParse = subQueryResponse.data;
        console.log('line 74', responseToParse);
        // console.log('line 75', parse(JSON.stringify(responseToParse)));
        this.splitResponse(splitQuery, responseToParse);
        // console.log('logging map after splitresponse: ', splitQuery);
        this.responseReady = this.isResponseReady(splitQuery);
        if (this.responseReady) {
          return this.maptoGQLResponse(splitQuery);
        } else {
          console.log('we have a problem');
        }
        //const parsedSubQueryResponse = parse(JSON.stringify(subQueryResponse));
        // const parseString = JSON.stringify(subQueryResponse)
        //console.log('line 73', typeof parseString)
        //console.log('sub query response', parseString);
        //console.log('logging parsed sub query response', parsedSubQueryResponse);
      }
    }
  }

  //BREAK QUERY INTO INDIVIDUAL FIELD LEVEL QUERIES
  splitQuery() {
    const startTime = performance.now();
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
        console.log('LOGGING SPLITQUERY args: ', keyObj.args);
        // ASK MEREDITH FOR THOUGHTS ON THIS:
        // we could just check the cache for this keyObj right here
        // and assign the result of that to the value in the map,
        // rather than doing it in a separate method

        // put keyObj in map
        keyMap.set(keyObj, null);
      }
    }
    this.mapLength = keyMap.size;
    const endTime = performance.now();
    console.log('splitQueries time: ', endTime - startTime);
    return keyMap;
  }

  //Loop through map and check to see if in cache

  //TO UPDATE ANY ANY TO CREATE AN INTERFACE
  //modifies map
  async checkQueries(map: Map<any, any>) {
    const startTime = performance.now();
    for (let [key, _value] of map) {
      //console.log('individual key', key);
      let stringifyKey: string = JSON.stringify(key);
      let cacheResponse = await this.checkRedis(stringifyKey);
      if (cacheResponse !== null) {
        this.totalHits++;
        //return response
        //console.log('line 115', value);
        // console.log('array key?', key);
        map.set(key, cacheResponse);
        //console.log('-----------ENTERING ELSE-------------');
        // console.log(cacheResponse);
      }
    }
    console.log('updated map', map);
    const endTime = performance.now();
    console.log('checkQueries time: ', endTime - startTime);
  }

  buildSubGraphQLQuery(map: Map<any, any>) {
    const startTime = performance.now();
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

    let query = `query {  ${type} (${arg}) { ${fields}} }`;
    console.log(query);
    const endTime = performance.now();
    console.log('buildSubGraphQLQuery time: ', endTime - startTime);
    return query;
  }

  async isCacheEmpty() {
    const startTime = performance.now();
    // invoke redisdb.DBSIZE to check whether cache is empty
    // return true if empty, false if not
    const dbSize = await this.redisdb.DBSIZE();
    console.log('in isCacheEmpty');
    console.log(dbSize);
    const endTime = performance.now();
    console.log('isCacheEmpty time: ', endTime - startTime);
    if (dbSize === 0) {
      return true;
    } else {
      return false;
    }
  }

  async queryToDB(query: string) {
    const startTime = performance.now();
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
    const endTime = performance.now();
    console.log('query to DB time: ', endTime - startTime);
    // return response from db
    return dbRes;
  }
  /*
//we know whole string is not in data base.
//get from database -> request to route api/query sending query string in body
//store key value pair on cache -> redis.set('key'), 'value'

  

  get / check redis method
   */

  splitResponse(map: Map<any, any>, response: any) {
    const startTime = performance.now();
    let index = 0;
    let mapIterator = map.keys();
    const refObj: any = {};
    for (const key of mapIterator) {
      refObj[key.field] = key;
    }
    for (const [_name, fields] of Object.entries(response)) {
      const anyFields: any = fields;
      for (const [field, fieldVal] of Object.entries(anyFields)) {
        map.set(refObj[field], fieldVal);
        this.redisdb.set(JSON.stringify(refObj[field]), fieldVal);
      }
      index++;
    }
    const endTime = performance.now();
    console.log('splitResponse time: ', endTime - startTime);
  }

  isResponseReady(map: Map<any, any>) {
    for (let [key, _value] of map) {
      if (map.get(key) === null) {
        return false;
      }
    }
    return true;
  }

  maptoGQLResponse(map: Map<any, any>) {
    const startTime = performance.now();
    const responseObj: any = { data: {} };
    const type: string = map.keys().next().value.type;
    responseObj.data[type] = {};

    for (let [key, value] of map) {
      responseObj.data[type][key.field] = value;
    }
    // let type,
    //   fields = '';
    // for (let [key, value] of map) {
    //   fields += key.field + ': ' + value + ', ';
    //   type = key.type;
    // }
    // {"data":{"people":{"name":"Luke Skywalker","mass":77,"eye_color":"blue"}}}
    // const response = `{ data: {  ${type}:  { ${fields}} } }`;
    console.log(responseObj);
    const endTime = performance.now();
    console.log('maptoGQLResponse time: ', endTime - startTime);
    return responseObj;
  }
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
