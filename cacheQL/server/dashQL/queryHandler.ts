const redisdb = require('../redis');
const { parse } = require('graphql/language/parser');

function queryHandler(req: any, _res: any, next: any) {
  //get query from request body
  console.log('--------LOGGING REQ.BODY.QUERY---------');
  console.log(req.body.query);
  const query = req.body.query;
  //parse query
  const parsedQuery = parse(query);
  console.log('--------LOGGING PARSED QUERY------------');
  console.log(
    parsedQuery.definitions[0].selectionSet.selections[0].arguments[0]
  );

  //send to get handled in dashCache.

  //if query has already been made and the response is already in the cache. return response

  // if not, cache query and response and return response

  //res.locals - response and response time

  return next();
}

module.exports = queryHandler;
