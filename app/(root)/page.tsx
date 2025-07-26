'use client'

import dynamic from 'next/dynamic';
import Dash from '@/Pages/homepage';
import { ClerkProvider } from '@clerk/nextjs';

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



export default function Home({ params }: { params: Promise<{ id: string }> }) {
  
  return (
    // <ClerkProvider {...params}>
    <ClerkProvider {...params} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>

      {/* User bubble at the top right corner */}
      <div className="sticky top-5 z-50" style={{display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-start', marginTop:'-50px', marginLeft: '200px'}}>
        <SignedIn>
          <UserButton afterSwitchSessionUrl='/' />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>

      {/* Actual homepage */}
      <h1 className="text-2xl font-light mb-8 mt-8" style={{ color: 'gray', fontSize: "24px" }}>
        Your HiPex Pages
      </h1>

      <Dash />
      
    </ClerkProvider>
  );

}






