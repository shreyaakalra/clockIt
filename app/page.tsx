import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  
  const session = await auth0.getSession();
  console.log(session);

  return (
    <div className="bg-brand-bg text-brand-text">
      <Navbar isLoggedIn={!!session} />
      <Hero isLoggedIn={!!session} />
      <Features />
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-8 text-sm text-brand-text">
        clock it &middot; built for care homes and supported accommodations
      </footer>
    </div>
  );
}