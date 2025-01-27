import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import type { AppProps } from 'next/app';

function Header() {
  //this is for the top right corner profile bubble
  return (
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
  );
}

function Home({ pageProps }: { pageProps: AppProps['pageProps'] }) {
  return (
    <ClerkProvider {...pageProps}>
      <Header />
    </ClerkProvider>
  );
}

export default Home;
