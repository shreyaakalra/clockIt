import prisma from "@/lib/prisma"
import { AddPerimeterArgs, ShowPerimeterArgs } from "../types"

export const perimeterResolver = {

    Query: {
        showPerimeter: async(_parent: unknown, args: ShowPerimeterArgs) => {
            return prisma.perimeter.findMany({
                where: {
                    orgId: args.orgId
                }
            })
        }
    },

    Mutation: {
        addPerimeter: async(_parent: unknown, args: AddPerimeterArgs) => {
            return prisma.perimeter.create({
                data: {
                    name: args.name, 
                    latitude: args.latitude,
                    longitude: args.longitude,
                    radius: args.radius,
                    orgId: args.orgId
                }
            })
        }
    }
    
}