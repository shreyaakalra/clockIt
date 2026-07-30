import prisma from "@/lib/prisma"
import { CreateOrganizationArgs, OrganizationByInviteCodeArgs } from "../types"

export const organizationResolver = {
    Query: {
        organizationByInviteCode: async(_parent: unknown, args: OrganizationByInviteCodeArgs) => {
            return prisma.organization.findUnique({
                where: {
                    inviteCode: args.inviteCode
                }
            })
        }
    },

    Mutation: {
        createOrganization: async(_parent: unknown, args: CreateOrganizationArgs) => {
            return prisma.organization.create({
                data: {
                    name: args.name,
                    inviteCode: args.inviteCode
                }
            })
        }
    }
}