import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { authId: session.user.sub },
  });

  if (!user || user.role !== "MANAGER") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}