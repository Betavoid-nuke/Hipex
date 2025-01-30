import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import type { AppProps } from 'next/app';

function Home({ pageProps }: { pageProps: AppProps['pageProps'] }) {
  return (
    <ClerkProvider {...pageProps}>

      {/* User bobble at the top right corner */}
      <div style={{ position: 'absolute', top: 15, right: 20 }}>
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton afterSwitchSessionUrl='/' />
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <SignInButton />
        </SignedOut>
      </div>

    </ClerkProvider>
  );
}

export default Home;
