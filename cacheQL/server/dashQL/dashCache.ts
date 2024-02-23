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

  async cacheHandler() {
    const splitQuery = this.splitQuery();
    //populate map with keys
    await this.checkQueries(splitQuery);
    // we want to do some logic to determine whether this needs to be called
    this.responseReady = this.isResponseReady(splitQuery);
    if (this.responseReady) {
      return this.maptoGQLResponse(splitQuery);
    } else {
      const subGQLQuery = this.buildSubGraphQLQuery(splitQuery);
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
        // check whether there's a nested query
        const keyObj = {
          type: typesArr[i].name.value,
          args: typesArr[i].arguments,
          field: {},
        };

        this.splitNestedQuery(fieldsArr[j], keyMap, keyObj.field, keyObj);
      }
    }
    this.mapLength = keyMap.size;
    //console.log('FIRST KEY OF MAP', keyMap.keys().next().value);
    console.log(keyMap);
    //const mapKeys = keyMap.keys();
    // console.log('MAP ------ >>>>>', mapKeys.next().value);
    // console.log('MAP ------ >>>>>', mapKeys.next().value);
    return keyMap;
  }
  splitNestedQuery(
    nestedQueryObj: any,
    map: any,
    keyObjField: any,
    keyObj: any
  ) {
    const fieldLevelTest = nestedQueryObj;
    //const keyObjFieldCopy = Object.assign({}, keyObjField);
    
    if (!fieldLevelTest.selectionSet) {
      //base case return name.value
      // keyObj['field'] = { name: fieldLevelTest.name.value };
      keyObjField['name'] = fieldLevelTest.name.value;
      //keyObjFieldCopy['name'] = fieldLevelTest.name.value;
      // const keyObjCopy = Object.assign({}, keyObj);
      //console.log('key obj copy', keyObjCopy);

      map.set(JSON.stringify(keyObj), null);
      // console.log('------------LOGGING KEYOBJ: ', keyObj);
     //console.log('MAP ------ >>>>>', map.keys().next().value);

      return;
    }

    keyObjField['field'] = {};
    // keyObjFieldCopy['field'] = {};
    // iterate through fieldLevelTest.selectionSet.selections --> fields of the selection set

    for (let i = 0; i < fieldLevelTest.selectionSet.selections.length; i++) {
      
      keyObjField['name'] = fieldLevelTest.name.value;
      // keyObjFieldCopy['name'] = fieldLevelTest.name.value;
      //recursively call SNQ
      this.splitNestedQuery(
        fieldLevelTest.selectionSet.selections[i],
        map,
        keyObjField['field'],
        // keyObjFieldCopy['field'],
        keyObj
      );
      
    }

    /*       const keyObj = {
        type: type.name.value,
        args: type.arguments,
        field: {
          name: species
          field: {
            name: 
          }
        }
        */
  }
  //Loop through map and check to see if in cache

  //TO UPDATE ANY ANY TO CREATE AN INTERFACE
  //modifies map
  async checkQueries(map: Map<any, any>) {
    for (const [key, _value] of map) {
      // let stringifyKey: string = JSON.stringify(key);
      // let cacheResponse = await this.checkRedis(stringifyKey);
      const cacheResponse = await this.checkRedis(key);
      if (cacheResponse !== null) {
        this.totalHits++;
        map.set(key, cacheResponse);
      }
    }
  }

  buildSubGraphQLQuery(map: Map<any, any>) {
    const queryArr: any[] = [];

    for (const [key, value] of map) {
      if (value === null) {
        queryArr.push(JSON.parse(key));
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
      // need to create array of all nested fields
      // then we can iterate through that and create the fields string
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
    let query = `query {  ${type} (${arg}) { ${fields}} }`;

    /*       const keyObj = {
        type: type.name.value,
        args: type.arguments,
        field: {
          name: species
          field: {
            name: 
          }
        }
        */
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
    console.log(dbRes);
    // return response from db
    return dbRes;
  }

  splitResponse(map: Map<any, any>, response: any) {
    const startTime = performance.now();
    const mapIterator = map.keys();
    // console.log('Map Iterator --------->', mapIterator);
    const refObj: any = {};
    for (const key of mapIterator) {
      const parsedKey = JSON.parse(key);
      refObj[parsedKey.field.name] = parsedKey;
    }
    // console.log('logging refObj: ', refObj);
    for (const [_name, fields] of Object.entries(response)) {
      let anyFields: any = fields;
      for (const [field, fieldVal] of Object.entries(anyFields)) {
        console.log('field val --------', fieldVal)
        let currentFieldVal = fieldVal;
        while(typeof currentFieldVal === 'object')
        
        /* 
        field val -------- Luke Skywalker
        field val -------- { name: 'Human', classification: 'mammal' }
        */
        }
       //console.log('ref object ---------', refObj[field])
        map.set(JSON.stringify(refObj[field]), fieldVal);
        this.redisdb.set(JSON.stringify(refObj[field]), fieldVal);
      }
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
      // change to key.field.name to fix '[object Object]'s
      responseObj.data[type][key.field.name] = value;
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
