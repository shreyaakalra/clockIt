import prisma from "@/lib/prisma";
import { AddNewUserArgs, GetUserInformationArgs } from "../types";
import { GraphQLError } from "graphql";


export const userResolver = {

    Query: {
        getUserInformation: async(_parent: unknown, args: GetUserInformationArgs) => {
            return await prisma.user.findUnique({
                where: {
                    id: args.id
                }
            })
        }
    },

    Mutation: {
        addNewUser: async(_parent: unknown, args: AddNewUserArgs) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: args.email
                }
            });

            if(user){
                throw new GraphQLError("User already exists.")
            }

            return await prisma.user.create({
                data: {
                    authId: args.authId,
                    email: args.email,
                    name: args.name,
                    organizationId: args.organizationId,
                    role: args.role
                }
            })
        }
    }
}