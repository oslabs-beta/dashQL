const db = require('../models/model');

// const {
//   GraphQLSchema,
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLInt,
//   // GraphQLList,
//   // GraphQLNonNull,
// } = require('graphql');
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  // GraphQLList,
  // GraphQLNonNull,
} from 'graphql';

const peopleType = new GraphQLObjectType({
  name: 'People',
  //lazily defined to add a function in fields. opportunity to easily reference inside the function if there was a circular reference.
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    mass: {
      type: GraphQLInt,
    },
    hair_color: {
      type: GraphQLString,
    },
    eye_color: {
      type: GraphQLString,
    },
  }),
});

const planetType = new GraphQLObjectType({
  name: "Planets",
  //lazily defined to add a function in fields. opportunity to easily reference inside the function if there was a circular reference.
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    population: {
      type: GraphQLInt,
    },
    terrain: {
      type: GraphQLString,
    },
    climate: {
      type: GraphQLString,
    },
  }),
});

// const languagesType = new GraphQLObjectType({
//   name: 'Language',
//   // not lazily defined because there are no circular dependencies
//   fields: {
//     code: { type: GraphQLString },
//     name: { type: GraphQLString },
//   },
// });

const RootQuery = new GraphQLObjectType({
  name: 'query',
  fields: {
    people: {
      type: peopleType,
      // args: {},
      args: { _id: { type: GraphQLInt } },
      resolve: async (parent: any, args: any) => {
        console.log(parent);
        const sqlQuery = `SELECT * FROM people WHERE _id=${args._id}`;
        const data = await db.query(sqlQuery);
        return data.rows[0];
      },
    },
    planets: {
      type: planetType,
      // args: {},
      args: { _id: { type: GraphQLInt } },
      resolve: async (parent: any, args: any) => {
        console.log(parent)
        const idStr = args._id ? `WHERE _id=${args._id}` : ""
        const sqlQuery = `SELECT * FROM planets ${idStr}`;
        const data = await db.query(sqlQuery);
        console.log("data rows", data.rows);
        // return data.rows.length > 1 ? data.rows : data.rows[0];
      },
    },
  },
});

// export const schema = new GraphQLSchema({
//   query: RootQuery,
// });
// module.exports = {
//   schema: new GraphQLSchema({
//     query: RootQuery,
//   }),
// };
export default new GraphQLSchema({
  query: RootQuery,
});
