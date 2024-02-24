const db = require('../models/model');

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
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
    height: {
      type: GraphQLInt,
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

const planetType = new GraphQLObjectType({
  name: 'Planets',
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
    planets: {
      type: planetType,
      args: { _id: { type: GraphQLInt } },
      resolve: async (parent: any, args: any) => {
        console.log(parent);
        const idStr = args._id ? `WHERE _id=${args._id}` : '';
        const sqlQuery = `SELECT * FROM planets ${idStr}`;
        const data = await db.query(sqlQuery);
        console.log('data rows', data.rows);
        return data.rows.length > 1 ? data.rows : data.rows[0];
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
