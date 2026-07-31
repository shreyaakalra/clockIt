import prisma from "@/lib/prisma"
import { CreateOrganizationArgs, OrganizationByIdArgs, OrganizationByInviteCodeArgs } from "../types"
import { customAlphabet } from "nanoid";

const generateInviteCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789", 8);

export const organizationResolver = {

    Query: {
        organizationByInviteCode: async(_parent: unknown, args: OrganizationByInviteCodeArgs) => {
            return prisma.organization.findUnique({
                where: {
                    inviteCode: args.inviteCode
                }
            })
        },
        
        organizationById: async(_parent: unknown, args: OrganizationByIdArgs) => {
            return prisma.organization.findUnique({
                where: {
                    id: args.id
                }
            })
        }
    },

    Mutation: {
        createOrganization: async(_parent: unknown, args: CreateOrganizationArgs) => {
            return prisma.organization.create({
                data: {
                    name: args.name,
                    inviteCode: generateInviteCode()
                }
            })
        }
    }
}