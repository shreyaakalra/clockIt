export const shiftTypeDefs = `
    
    type Shift{
        id: Int
        userId: Int
        perimeterId: Int
        clockInTime: String
        clockInLatitude: Float
        clockInLongitude: Float
        clockInNote: String
        clockOutTime: String
        clockOutLatitude: Float
        clockOutLongitude: Float
        clockOutNote: String
    }

    type Query{
        showShiftDetails(userId: Int!): Shift
    }

    type Mutation{
        clockIn(userId: Int!, perimeterId: Int!, clockInLatitude: Float!, clockInLongitude: Float!, clockInNote: String): Shift

        clockOut(shiftId: Int!, clockOutLatitude: Float!, clockOutLongitude: Float!, clockOutNote: String): Shift
    }
`