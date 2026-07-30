import { organizationResolver } from "./organization";
import { perimeterResolver } from "./perimeter";
import { userResolver } from "./user";
import { shiftResolver } from "./shift";

export const resolvers = {
    Query: {
        ...organizationResolver.Query,
        ...perimeterResolver.Query,
        ...userResolver.Query,
        ...shiftResolver.Query,
    },
    Mutation: {
        ...organizationResolver.Mutation,
        ...perimeterResolver.Mutation,
        ...userResolver.Mutation,
        ...shiftResolver.Mutation,
    },
};