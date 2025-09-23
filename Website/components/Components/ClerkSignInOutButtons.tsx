import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";


export default function ClerkSignInOutButtons() {

    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <SignedIn>
              <UserButton afterSwitchSessionUrl='/' />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
        </ClerkProvider>
    )
}