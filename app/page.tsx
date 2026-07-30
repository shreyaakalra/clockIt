import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth0.getSession();

  if (!session) {

    return (
      <div className="bg-brand-bg text-brand-text">
      <Navbar />
      <Hero />

      </div>
    );

  }

  const sub = session.user.sub;

  const user = await prisma.user.findUnique({
    where: { authId: sub },
  });

  if (!user) {
    redirect('/onboarding');
  }

  const role = user.role;

  if (role === "MANAGER") {
    redirect('/manager/dashboard');
  }

  if (role === "CARE_WORKER") {
    redirect('/dashboard');
  }
}

  



