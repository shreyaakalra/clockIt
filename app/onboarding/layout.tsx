import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { authId: session.user.sub },
  });

  if(user){
    redirect(user.role === "MANAGER" ? "/manager/settings" : "/dashboard")
  }

  return <>{children}</>;
}