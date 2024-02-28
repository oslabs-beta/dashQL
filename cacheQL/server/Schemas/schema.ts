const db = require('../models/model');

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

const peopleType = new GraphQLObjectType({
  name: 'People',
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
    species_id: {
      type: GraphQLInt,
    },
    species: {
      type: speciesType,
      resolve: async (parent: any) => {
        console.log(parent);
        const sqlQuery = `SELECT * FROM species WHERE _id=${parent.species_id}`;
        const data = await db.query(sqlQuery);
        return data.rows[0];
      },
    },
  }),
});

// const PlanetType = new GraphQLObjectType({
//   name: 'Planets',
//   fields: () => ({
//     _id: {
//       type: new GraphQLNonNull(GraphQLInt),
//     },
//     name: {
//       type: GraphQLString,
//     },
//     population: {
//       type: GraphQLInt,
//     },
//     terrain: {
//       type: GraphQLString,
//     },
//     climate: {
//       type: GraphQLString,
//     },

//   }),
// });

const planetType = new GraphQLObjectType({
  name: 'Planets',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: GraphQLString,
    },
    terrain: {
      type: GraphQLString,
    },
    climate: {
      type: GraphQLString,
    },
    diameter: {
      type: GraphQLInt,
    },
  }),
});

const speciesType = new GraphQLObjectType({
  name: 'Species',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    classification: {
      type: GraphQLString,
    },
    average_height: {
      type: GraphQLString,
    },
    homeworld_id: {
      type: GraphQLInt,
    },
    homeworld: {
      type: planetType,
      resolve: async (parent: any) => {
        console.log(parent);
        const sqlQuery = `SELECT * FROM planets WHERE _id=${parent.homeworld_id}`;
        const data = await db.query(sqlQuery);
        return data.rows[0];
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'query',
  fields: {
    people: {
      type: peopleType,
      args: { _id: { type: GraphQLInt } },
      resolve: async (parent: any, args: any) => {
        console.log(parent);
        const sqlQuery = `SELECT * FROM people WHERE _id=${args._id}`;
        const data = await db.query(sqlQuery);
        return data.rows[0];
      },
    },

    peopleNoId: {
      type: new GraphQLList(peopleType),
      resolve: async (parent: any, args: any) => {
        const sqlQuery = `SELECT * FROM people`;
        const data = await db.query(sqlQuery);
        console.log('in non id data', data.rows);
        console.log(parent, args);
        return data.rows;
      },
    },
    planets: {
      type: planetType,
      // args: {},
      args: { _id: { type: GraphQLInt } },
      resolve: async (parent: any, args: any) => {
        const sqlQuery = `SELECT * FROM planets WHERE _id=${args._id}`;
        const data = await db.query(sqlQuery);
        // console.log("data rows", data.rows);
        console.log('in id data', data.rows[0]);
        console.log(parent, args);
        return data.rows[0];
      },
    },
    planetsNoId: {
      type: new GraphQLList(planetType),
      resolve: async (parent: any, args: any) => {
        const sqlQuery = `SELECT * FROM planets`;
        const data = await db.query(sqlQuery);
        console.log('in non id data', data.rows);
        console.log(parent, args);
        return data.rows;
      },
    },
  },
});
export default new GraphQLSchema({
  query: RootQuery,
});
