export const userTypeDefs = `

    enum Role{
        MANAGER
        CARE_WORKER
    }

    type User{
        id: Int
        authId: String
        email: String
        name: String
        role: Role
        organizationId: Int
        perimeterId: Int
        createdAt: String
        shifts: [Shift]
    }

    type Query{
        getUserInformation(id: Int!): User
        getUserInformationByEmail(email: String!): User
    }

    type Mutation{
        addNewUser(authId: String!, email: String!, name: String!, role: Role!, organizationId: Int!): User
    }
    
`