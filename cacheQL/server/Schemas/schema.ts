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
  // GraphQLInt,
  // GraphQLList,
  // GraphQLNonNull,
}  = require ('graphql');

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
      resolve: async () => {
        //temp deleted parent and args
        console.log('reached country resolver')
        try {
          return await fetch('https://countries.trevorblades.com')
        }
        catch (err) {
          throw err
        }
      }
    },
    language: {
      type: languagesType,
      //resolve
    },
  },
});

// export const schema = new GraphQLSchema({
//   query: RootQuery,
// });
module.exports = {schema: new GraphQLSchema({
  query: RootQuery,
})}
