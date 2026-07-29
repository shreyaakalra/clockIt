export const perimeterTypeDefs = `

    type Perimeter{
        id: Int
        name: String
        latitude: Float
        longitude: Float
        radius: Float
        createdAt: String
        orgId: Int
        shifts: [Shift]
    }

    type Query{
        showPerimeter(orgId: Int!): [Perimeter]
    }

    type Mutation{
        addPerimeter(name: String!, latitude: Float!, longitude: Float!, radius: Float!, orgId: Int!): Perimeter
    }
`