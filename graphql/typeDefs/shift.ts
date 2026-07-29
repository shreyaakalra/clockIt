export const shiftTypeDef = `
    
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

    type Mitigation{
        clockIn(userId: Int!, perimeterId: Int!, clockInLatitude: Float!, clockInLongitude: Float!, clockInNote: String): Shift
    }
`