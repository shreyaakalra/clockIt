import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <div className="bg-brand-bg text-brand-text">
      <Navbar isLoggedIn={!!session} />
      <Hero isLoggedIn={!!session} />
    </div>
  );
}