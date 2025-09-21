import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snooker Score Tracker",
  description: "Track snooker frames, find venues, and compete on leaderboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-900 text-white min-h-screen font-sans`}>
          {/* --- NEW FULLY-FEATURED HEADER --- */}
          <header className="bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto max-w-lg h-16 flex justify-between items-center p-4">
              {/* App Title */}
              <h1 className="text-xl font-bold text-emerald-400">
                CueTracker
              </h1>

              {/* Authentication Controls */}
              <div className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm px-4 py-2 transition-transform transform active:scale-95">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>
              </div>
            </div>
          </header>

          {/* Main Page Content */}
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}