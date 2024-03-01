import { DocumentNode } from 'graphql';

class dashCache {
  query: DocumentNode;
  redisdb: any;
  responseReady: boolean;
  totalHits: number;
  mapLength: number;
  nestedResponseCounter: number;
  map: Map<any, any>;
  id: boolean;

  constructor(parsedQuery: DocumentNode, redisdb: any) {
    this.query = parsedQuery;
    this.redisdb = redisdb;
    this.responseReady = false;
    this.totalHits = 0;
    this.mapLength = 0;
    this.nestedResponseCounter = 0;
    this.id = true;
    this.map = new Map();
  }

  async cacheHandler() {
    this.splitQuery();
    //populate map with keys
    console.log('going into this.checkQueries');
    await this.checkQueries();
    console.log('going into this.isResponseReady');
    this.responseReady = this.isResponseReady();
    if (this.responseReady) {
      console.log('IS READY, returning maptogqlresponse');
      return this.maptoGQLResponse();
    } else {
      console.log('IS NOT READY, going into this.buildSubGraphQLQuery');
      const subGQLQuery = this.buildSubGraphQLQuery();
      console.log('going into this.queryToDb');
      const subQueryResponse = await this.queryToDB(subGQLQuery);
      console.log(
        'sub query response',
        subQueryResponse.data,
        'split query',
        this.map
      );
      console.log('going intomaptogqlresponse from querytodb');
      const responseToParse = subQueryResponse.data;
      JSON.parse(this.map.keys().next().value).args[0]
        ? this.splitResponse(responseToParse)
        : this.splitResponseArray(this.map, responseToParse);
      this.responseReady = this.isResponseReady();
      if (this.responseReady) {
        return this.maptoGQLResponse();
      } else {
        console.log('theres an error---');
        throw new Error('DashQL encountered an error.');
      }
    }
  }

  //BREAK QUERY INTO INDIVIDUAL FIELD LEVEL QUERIES
  splitQuery() {
    // create object to store individual fields
    const keyMap = this.map;
    // have to make anyQuery bc typescript is annoying
    const anyQuery: any = this.query;
    // array of all types
    const typesArr = anyQuery.definitions[0].selectionSet.selections;
    console.log('typesArr in splitQuery: ', typesArr);
    //  iterate through selections arr {
    for (let i = 0; i < typesArr.length; i++) {
      const fieldsArr = typesArr[i].selectionSet.selections;
      //    iterate through fields arr
      for (let j = 0; j < fieldsArr.length; j++) {
        // check whether there's a nested query
        const keyObj = {
          type: typesArr[i].name.value,
          args: typesArr[i].arguments,
          field: {},
        };
        this.splitNestedQuery(fieldsArr[j], keyObj.field, keyObj);
      }
    }
    this.mapLength = keyMap.size;
  }

  splitNestedQuery(nestedQueryObj: any, keyObjField: any, keyObj: any) {
    const fieldLevelTest = nestedQueryObj;

    if (!fieldLevelTest.selectionSet) {
      keyObjField['name'] = fieldLevelTest.name.value;
      this.map.set(JSON.stringify(keyObj), null);
      return;
    }

    keyObjField['field'] = {};

    for (let i = 0; i < fieldLevelTest.selectionSet.selections.length; i++) {
      keyObjField['name'] = fieldLevelTest.name.value;
      //recursively call SNQ
      this.splitNestedQuery(
        fieldLevelTest.selectionSet.selections[i],
        keyObjField['field'],
        keyObj
      );
    }
  }

  async isJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  //Loop through map and check to see if in cache if so, modify map
  //* TO UPDATE ANY ANY TO CREATE AN INTERFACE
  async checkQueries() {
    for (const [key, _value] of this.map) {
      const cacheResponse = await this.checkRedis(key);
      const isJsonStr = await this.isJsonString(cacheResponse);
      const finalResponse = isJsonStr
        ? JSON.parse(cacheResponse)
        : cacheResponse;
      if (cacheResponse !== null) {
        this.totalHits++;
        this.map.set(key, finalResponse);
        console.log('IN CACHE!', this.map);
      }
    }
  }

  buildSubGraphQLQuery() {
    const queryArr: any[] = [];

    for (const [key, value] of this.map) {
      if (value === null) {
        queryArr.push(JSON.parse(key));
      }
    }

    let type = '';
    let arg = '';
    let fields = '';
    if (queryArr.length > 0) {
      //* probably wanna change this part when we add functionality for accepting multiple types
      type += queryArr[0].type;
      queryArr[0].args.forEach((el: any) => {
        arg += el.name.value + ': ' + el.value.value + ', ';
      });

      // create array of all nested fields, iterate through to create the fields string
      for (let i = 0; i < queryArr.length; i++) {
        let nestedCount: number = 0;
        let currentField = queryArr[i].field;
        while (currentField.field) {
          fields += `${currentField.name} {`;

          nestedCount++;
          currentField = currentField.field;
        }
        fields += currentField.name + ', ';
        fields += '}'.repeat(nestedCount);
      }
    }
    let idValue = arg ? `(${arg})` : '';
    let query = `query {  ${type} ${idValue} { ${fields}} }`;
    console.log('arg-----------', arg, '/', query);
    return query;
  }

  async queryToDB(query: string) {
    const startTime = performance.now();
    const bodyObj = { query: query };
    // make request to server (/api/query) with entire query string
    const jsonDBRes = await fetch(
      'https://dash-ql-backend.vercel.app/api/query',
      {
        method: 'POST',
        body: JSON.stringify(bodyObj),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const dbRes = await jsonDBRes.json();
    const endTime = performance.now();
    console.log('query to DB time: ', endTime - startTime);
    console.log(dbRes, '------------------');
    // return response from db
    return dbRes;
  }

  // split response method for when user asking for fields without specific id associated with them
  splitResponseArray(map: Map<any, any>, response: any) {
    const startTime = performance.now();

    // create variable for the response data array
    let type: string = '';
    for (let key in response) {
      type = key;
    }
    const responseArr: any = response[type];

    // find which fields need to be logged into cache
    const fields: string[] = [];
    for (let key in responseArr[0]) {
      fields.push(key);
    }

    // create temp object to hold array of all fields asked for (ex: name: ['all response names'])
    const obj: any = {};
    for (const field of fields) {
      obj[field] = responseArr.map((curr: any) => curr[field]);
    }

    // set map values to be equal to the created arrays
    for (const [field] of map) {
      const parsedField = JSON.parse(field);
      console.log('LOGGING FIELD', parsedField);
      console.log('LOGGING OBJ[FIELD.FIELD]', obj[parsedField.field.name]);
      map.set(field, obj[parsedField.field.name]);
      this.redisdb.set(field, JSON.stringify(obj[parsedField.field.name]));
    }

    console.log('final map is', map);

    // cache map into redis

    const endTime = performance.now();
    console.log('splitResponseArray time: ', endTime - startTime);
  }

  splitResponse(response: any) {
    const startTime = performance.now();
    const mapIterator = this.map.entries();

    const refObj: any = {};
    let counter = 0;
    for (const [key, value] of mapIterator) {
      if (value === null) {
        const parsedKey = JSON.parse(key);
        let currentKey = parsedKey;
        while (currentKey.field.field) {
          currentKey = currentKey.field;
        }
        refObj[currentKey.field.name + counter] = parsedKey;
        counter++;
      }
    }

    for (const [_name, fields] of Object.entries(response)) {
      let anyFields: any = fields;

      for (const [field, fieldVal] of Object.entries(anyFields)) {
        this.splitNestedResponse(field, fieldVal, refObj);
      }
    }
    const endTime = performance.now();
    console.log('splitResponse time: ', endTime - startTime);
  }

  splitNestedResponse(field: any, fieldVal: any, refObj: any) {
    if (typeof fieldVal !== 'object') {
      // set in map
      this.map.set(
        JSON.stringify(refObj[field + this.nestedResponseCounter]),
        fieldVal
      );
      this.redisdb.set(
        JSON.stringify(refObj[field + this.nestedResponseCounter]),
        fieldVal
      );
      this.nestedResponseCounter++;
      return;
    }
    for (const [key, value] of Object.entries(fieldVal)) {
      this.splitNestedResponse(key, value, refObj);
    }
  }

  isResponseReady() {
    for (let [key, _value] of this.map) {
      if (this.map.get(key) === null) {
        return false;
      }
    }
    return true;
  }

  maptoGQLResponse() {
    const responseObj: any = { data: {} };

    //* WILL NEED TO LOOP THROUGH TYPES TO HANDLE MULTIPLE TYPES
    const type: string = JSON.parse(this.map.keys().next().value).type;
    responseObj.data[type] = {};

    for (let [key, value] of this.map) {
      const parsedKey = JSON.parse(key);
      if (parsedKey.field.field) {
        if (!responseObj.data[type][parsedKey.field.name])
          responseObj.data[type][parsedKey.field.name] = {};
        let currentKey = parsedKey.field;
        let currentObj = responseObj.data[type][currentKey.name];
        while (currentKey.field) {
          currentKey = currentKey.field;
          if (!currentObj[currentKey.name]) currentObj[currentKey.name] = {};
          if (currentKey.field) currentObj = currentObj[currentKey.name];
        }

        currentObj[currentKey.name] = value;
      } else {
        responseObj.data[type][parsedKey.field.name] = value;
      }
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
