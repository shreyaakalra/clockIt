import prisma from "@/lib/prisma"
import { ClockInArgs, ClockOutArgs, ShowShiftDetailsArgs } from "../types"
import { GraphQLError } from "graphql";

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export const shiftResolver = {

    Query: {
        showShiftDetails: async(_parent: unknown, args: ShowShiftDetailsArgs) => {
            return prisma.shift.findMany({
                where: {
                    userId: args.userId
                }
            })
        },

        checkPerimeter: async (_parent: unknown, args: { perimeterId: number; latitude: number; longitude: number }) => {
            const perimeter = await prisma.perimeter.findUnique({
                where: { id: args.perimeterId },
            });

            if (!perimeter) {
                throw new GraphQLError("Perimeter not found.");
            }

            const distance = getDistanceKm(args.latitude, args.longitude, perimeter.latitude, perimeter.longitude);
            return distance <= perimeter.radius;
        },
    },

    Mutation: {
        clockIn: async(_parent: unknown, args: ClockInArgs) => {

            const openShift = await prisma.shift.findFirst({
                where: {
                    userId: args.userId,
                    clockOutTime: null
                }
            });

            if(openShift){
                throw new GraphQLError("You are already clocked in!");
            }

            const perimeter = await prisma.perimeter.findUnique({
                where: {
                    id: args.perimeterId
                }
            })

            if(!perimeter){
                throw new GraphQLError("Perimeter not found.");
            }

            const distance = getDistanceKm(
                args.clockInLatitude,
                args.clockInLongitude,
                perimeter.latitude,
                perimeter.longitude
            );

            if(distance>perimeter.radius){
                throw new GraphQLError("You are outside the allowed perimeter to clock in.")
            }

            return prisma.shift.create({
                data: {
                    userId: args.userId,
                    perimeterId: args.perimeterId,
                    clockInTime: new Date(),
                    clockInLatitude: args.clockInLatitude,
                    clockInLongitude: args.clockInLongitude,
                    clockInNote: args.clockInNote
                },
            });

        },

        clockOut: async(_parent: unknown, args: ClockOutArgs) => {
            const openShift = await prisma.shift.findFirst({
                where: {
                    id: args.shiftId
                }
            });

            if(!openShift){
                throw new GraphQLError("You haven't clocked in yet.")
            }

            if(openShift.clockOutTime){
                throw new GraphQLError("You have already clocked out.")
            }

            return prisma.shift.update({
                where: {
                    id: args.shiftId
                },
                data: {
                    clockOutTime: new Date(),
                    clockOutLatitude: args.clockOutLatitude,
                    clockOutLongitude: args.clockOutLongitude,
                    clockOutNote: args.clockOutNote
                }
            })
        },
    }
}