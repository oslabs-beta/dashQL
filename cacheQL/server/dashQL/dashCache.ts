import { DocumentNode } from 'graphql';

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

  async cacheHandler(_rawQuery: string) {
    const splitQuery = this.splitQuery();
    //populate map with keys
    await this.checkQueries(splitQuery);
    // we want to do some logic to determine whether this needs to be called
    this.responseReady = this.isResponseReady(splitQuery);
    if (this.responseReady) {
      return this.maptoGQLResponse(splitQuery);
    } else {
      const subGQLQuery = this.buildSubGraphQLQuery(splitQuery);
      console.log('------======', subGQLQuery)
      const subQueryResponse = await this.queryToDB(subGQLQuery);
      const responseToParse = subQueryResponse.data;
      this.splitResponse(splitQuery, responseToParse);
      this.responseReady = this.isResponseReady(splitQuery);
      if (this.responseReady) {
        return this.maptoGQLResponse(splitQuery);
      } else {
        console.log('we have a problem');
      }
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
        // put keyObj in map
        keyMap.set(keyObj, null);
      }
    }
    this.mapLength = keyMap.size;
    return keyMap;
  }

  //Loop through map and check to see if in cache

  //TO UPDATE ANY ANY TO CREATE AN INTERFACE
  //modifies map
  async checkQueries(map: Map<any, any>) {
    for (let [key, _value] of map) {
      let stringifyKey: string = JSON.stringify(key);
      let cacheResponse = await this.checkRedis(stringifyKey);
      if (cacheResponse !== null) {
        this.totalHits++;
        map.set(key, cacheResponse);
      }
    }
  }

  buildSubGraphQLQuery(map: Map<any, any>) {
    const queryArr: any[] = [];

    for (let [key, value] of map) {
      if (value === null) {
        queryArr.push(key);
      }
    }

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
    let idValue = arg ? `(${arg})` : ''
    let query = `query {  ${type} ${idValue} { ${fields}} }`;
    // console.log('arg-----------', arg, '/', query)
    return query;
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
    const dbRes = await jsonDBRes.json();
    const endTime = performance.now();
    console.log('query to DB time: ', endTime - startTime);
    console.log(dbRes, '------------------')
    // return response from db
    return dbRes;
  }

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
    const responseObj: any = { data: {} };
    const type: string = map.keys().next().value.type;
    responseObj.data[type] = {};

    for (let [key, value] of map) {
      responseObj.data[type][key.field] = value;
    }
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
