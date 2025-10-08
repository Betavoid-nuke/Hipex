"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getUserById } from "@/twinx/utils/twinxDBUtils.action";

interface AuthGuardProviderProps {
  children: React.ReactNode;
}

export default function AuthGuardProvider({ children }: AuthGuardProviderProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to finish loading

    const verifyAccess = async () => {
      try {
        // ✅ If user is on /twinx (homepage/onboarding), skip auth guard
        if (pathname === "/twinx") {
          setAuthorized(true);
          return;
        }

        // ❌ Not logged in
        if (!user) {
          router.replace("/twinx");
          return;
        }

        const fetchedUser = await getUserById(user.id);

        // ❌ No user found in DB
        if (!fetchedUser) {
          router.replace("/twinx");
          return;
        }

        // ❌ User not onboarded yet
        if (!fetchedUser.onboarded) {
          router.replace("/twinx");
          return;
        }

        // ✅ All checks passed
        setAuthorized(true);

      } catch (error) {
        console.error("❌ Auth guard error:", error);
        router.replace("/twinx");
      }
    };

    verifyAccess();
  }, [user, isLoaded, pathname, router]);

  // ⚡ No "Checking access..." UI — just don't render children until verified
  if (!authorized && pathname !== "/twinx") {
    return null;
  }

  return <>{children}</>;
}
