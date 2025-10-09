"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserById } from "@/twinx/utils/twinxDBUtils.action";
import { usePathname } from "next/navigation";

interface LimitedAccessProps {
  children: React.ReactNode;
}

export default function LimitedAccessComponent({ children }: LimitedAccessProps) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // If Clerk hasn't loaded yet, do nothing
      if (!isLoaded) return;

      // No user logged in → no access
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      try {
        const fetchedUser = await getUserById(user.id);

        if (fetchedUser && fetchedUser.onboarded) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("❌ Error checking access on limited access components:", error);
        setIsAuthorized(false);
      }
    };

    checkAccess();
  }, [user, isLoaded, pathname]);

  if (!isAuthorized) return null; // 🚫 Block rendering

  return <>{children}</>;
}
