import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import prisma from "./prisma";

export const auth0 = new Auth0Client({
  async onCallback(error, context, session) {
    if (error || !session) {
      return NextResponse.redirect(new URL("/", process.env.APP_BASE_URL));
    }

    const user = await prisma.user.findUnique({
      where: { authId: session.user.sub },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/onboarding", process.env.APP_BASE_URL));
    }

    const destination = user.role === "MANAGER" ? "/manager/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(destination, process.env.APP_BASE_URL));
  },
});