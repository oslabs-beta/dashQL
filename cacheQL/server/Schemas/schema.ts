// import {
//   GraphQLSchema,
//   GraphQLObjectType,
//   GraphQLString,
//   // GraphQLInt,
//   // GraphQLList,
//   // GraphQLNonNull,
// } from 'graphql';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  // GraphQLList,
  // GraphQLNonNull,
} = require('graphql');

const CountryType = new GraphQLObjectType({
  name: 'Country',
  //lazily defined to add a function in fields. opportunity to easily reference inside the function if there was a circular reference.
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    capital: {
      type: GraphQLString,
    },
  }),
});

const languagesType = new GraphQLObjectType({
  name: 'Language',
  // not lazily defined because there are no circular dependencies
  fields: {
    code: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'query',
  fields: {
    country: {
      type: CountryType,
      // args: {},
      args: { code: { type: GraphQLString } },
      resolve: async ( parent: any, args: any, context: any) => {
        //temp deleted parent and args
        console.log(parent);
        console.log(args);
        console.log(context.req.raw.body);
        console.log('reached country resolver');
        return new Promise((resolve, reject) => {
          fetch(`https://countries.trevorblades.com`, {
            method: 'POST',
            // body: JSON.stringify(context.req.raw.body),
          })
            .then((data) => data.json())
            .then((data) => {
              console.log(data)
              return data;
            })
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
        });
        // fetch('https://countries.trevorblades.com')
        // .then((data) => data.json())
        // .then((result) => console.log(result))

        // try {
        //   const response = await fetch('https://countries.trevorblades.com');
        //   const jsonresponse = response.json();
        //   console.log(jsonresponse);
        //   return jsonresponse
        // } catch (err) {
        //   throw err;
        // }
      },
    },
    language: {
      type: languagesType,
      //resolve
      resolve: () => {
        console.log('in language resolver');
      },
    },
  },
});

// export const schema = new GraphQLSchema({
//   query: RootQuery,
// });
module.exports = {
  schema: new GraphQLSchema({
    query: RootQuery,
  }),
};
