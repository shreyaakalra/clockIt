export const organizationTypeDefs = `

    type Organization{
        id: Int
        name: String
        inviteCode: String
        perimeters: [Perimeter]
        users: [User]
    }

    type Query{
        organizationByInviteCode(inviteCode: String!): Organization
        organizationById(id: Int!): Organization
    }

    type Mutation{
        createOrganization(name: String!): Organization
    }

`