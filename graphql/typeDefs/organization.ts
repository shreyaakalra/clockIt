export const organizationTypeDefs = `

    type Organization{
        id: Int
        name: String
        inviteCode: String
        perimeters: [Perimeter]
        users: [User]
    }

    type Query{
        organizationByInviteCode(inviteCode: String!): Organisation
    }

    type Mutation{
        createOrganization(name: String!, inviteCode: String!): Organization
    }

`