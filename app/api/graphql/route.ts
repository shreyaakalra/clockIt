import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "@/graphql/typeDefs";
import { resolvers } from "@/graphql/resolvers";

interface NextContext {
  params: Promise<Record<string, string>>;
}

const schema = createSchema<NextContext>({
  typeDefs,
  resolvers,
});

const { handleRequest } = createYoga<NextContext>({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};