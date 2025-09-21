'use client'

import dynamic from 'next/dynamic';
import Dash from '@/Pages/homepage';
import { ClerkProvider, useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { getCurrentUser, updateUserOnDB } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs/server';

// Dynamically import Clerk components to avoid hydration errors
const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), {
  ssr: false,
  loading: () => <div className="text-white" style={{color:'white'}}>Loading user...</div>,
});

const SignInButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignInButton), {
  ssr: false,
  loading: () => <div className="text-white" style={{color:'white'}}>Loading sign-in...</div>,
});

const SignedIn = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedIn), {
  ssr: false,
  loading: () => null,
});

const SignedOut = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedOut), {
  ssr: false,
  loading: () => null,
});

// This is the new, robust component that handles the sync logic.
function UserSyncAndContent() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth(); // 1. Get the getToken function from the useAuth hook.

  // Use a ref to ensure the sync operation only ever runs once per login.
  const hasSynced = useRef(false);

  // This useEffect is our trigger. It runs when Clerk's state changes.
  useEffect(() => {
    // This condition is the gatekeeper. It waits for Clerk to be fully loaded AND for a user to be signed in.
    if (isLoaded && isSignedIn && !hasSynced.current) {
      
      // Set the flag immediately to prevent any possible re-triggering.
      hasSynced.current = true;
      
      console.log("Clerk is ready and user is signed in. Preparing to sync with DB...");

      // Define an async function to handle the token and API call.
      const syncUser = async () => {
        try {
          // 2. Get the session token. This is the crucial step.
          // The getToken() function will not resolve until the session is fully established and valid.
          // This single line is what solves the entire race condition.

          console.log(getCurrentUser());
          
          updateUserOnDB();

          console.log("Database sync successful.");

        } catch (error) {
          console.error("User sync operation failed:", error);
          // If it fails, reset the flag so it can be tried again on a future render/state change.
          hasSynced.current = false;
        }
      };

      // Call the sync function.
      syncUser();
    }
  }, [isLoaded, isSignedIn, getToken]); // Dependency array ensures this logic runs when state is ready.

  // Render the actual page content.
  return (
    <>
      <div className="sticky top-5 z-50" style={{display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-start', marginTop:'-50px', marginLeft: '200px'}}>
        <SignedIn>
          <UserButton afterSwitchSessionUrl='/' />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>

      <h1 className="text-2xl font-light mb-8 mt-8" style={{ color: 'gray', fontSize: "24px" }}>
        Your HiPex Pages
      </h1>

      <Dash />
    </>
  );
}

// Your main export now simply wraps the logic component with the provider.
export default function Home() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <UserSyncAndContent />
    </ClerkProvider>
  );
}

































































