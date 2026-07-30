import { Role } from "@/app/generated/prisma/enums"


export type OrganizationByInviteCodeArgs = {
    inviteCode: string
}

export type CreateOrganizationArgs = {
    name: string,
    inviteCode: string
}

export type ShowPerimeterArgs = {
    orgId: number
}

export type AddPerimeterArgs = {
    name: string,
    latitude: number,
    longitude: number,
    radius: number,
    orgId: number
}

export type ShowShiftDetailsArgs = {
    userId: number
}

export type ClockInArgs = {
    userId: number,
    perimeterId: number,
    clockInLatitude: number,
    clockInLongitude: number,
    clockInNote?: string
}

export type ClockOutArgs = {
    shiftId: number,
    clockOutLatitude: number,
    clockOutLongitude: number,
    clockOutNote?: string
}

export type GetUserInformationArgs = {
    id: number
}

export type AddNewUserArgs = {
    authId: string,
    email: string,
    name: string,
    role: Role, 
    organizationId: number
}