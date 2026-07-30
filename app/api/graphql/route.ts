import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from '@/graphql/typeDefs';
import { resolvers } from '@/graphql/resolvers';

const schema = createSchema({
  typeDefs,
  resolvers
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request, Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};