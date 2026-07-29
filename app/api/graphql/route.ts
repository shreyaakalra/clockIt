import { createSchema, createYoga } from 'graphql-yoga';
import prisma  from '@/lib/prisma'

const schema = createSchema({
  typeDefs: `
    type Organization {
      id: Int,
      name: String,
      inviteCode: String
    }
    
    type Query{
        organizationByInviteCode(inviteCode: String!): Organization
    }

    type Mutation{
        createOrganization(name: String!, inviteCode: String!): Organization
    }
  `,
  
  resolvers: {
    Query: {
      organizationByInviteCode: async(_parent, args) => {
        return prisma.organization.findUnique({
            where: {
                inviteCode: args.inviteCode
            }
        })
      },
    },

    Mutation: {
        createOrganization: async(_parent, args) => {
            return prisma.organization.create({
                data: {
                    name: args.name,
                    inviteCode: args.inviteCode
                }
            });
        }
    }

  },
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