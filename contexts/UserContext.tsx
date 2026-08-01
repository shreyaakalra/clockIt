"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

type AppUser = {
  id: number;
  name: string;
  role: string;
  email: string;
  organizationId: number;
};

type UserContextValue = {
  appUser: AppUser | null;
  loading: boolean;
};

const UserContext = createContext<UserContextValue>({
  appUser: null,
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query($email: String!) {
              getUserInformationByEmail(email: $email) {
                id
                name
                email
                role
                organizationId
              }
            }
          `,
          variables: { email: user.email },
        }),
      });

      const result = await response.json();
      if (!result.errors) {
        setAppUser(result.data.getUserInformationByEmail);
      }
      setLoading(false);
    })();
  }, [user]);

  return (
    <UserContext.Provider value={{ appUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAppUser() {
  return useContext(UserContext);
}