"use client";

import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/twinx/components/AppSidebar";
import { NotificationProvider } from "@/twinx/components/AppNotification";
import { ClerkProvider } from "@clerk/nextjs";
import AuthGuardProvider from "@/General/Security/AuthGuardProvider";

/**
 * RootLayout component
 * This is the main client component layout that wraps the entire application.
 * It sets up the basic HTML structure and includes global styles + sidebar context.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body style={{ scrollbarWidth: "none" }}>
        {/* 👇 ClerkProvider wraps the entire app so useUser() works anywhere */}
        <ClerkProvider>
          {/* checks if the user is onboarded, and signedin, and has a account before showing page, i made this */}
          <AuthGuardProvider> 
            <SidebarProvider>
              <div className="flex h-screen" style={{ width: "-webkit-fill-available" }}>

                {/* Sidebar Section, Limited access component(my own provider which prints only when user is onboarded and signedin) */}
                <AppSidebar
                  currentView="dashboard"
                  onNavigate={(view) => console.log("Navigating to:", view)}
                />

                {/* Main Content Section */}
                <section
                  className="flex-1 flex flex-col p-2 overflow-auto"
                  style={{ width: "-webkit-fill-available", scrollbarWidth: "none" }}
                >
                  <NextTopLoader />
                  <div className="w-full h-full">
                    <NotificationProvider>{children}</NotificationProvider>
                  </div>
                  <Toaster />
                </section>

              </div>
            </SidebarProvider>
          </AuthGuardProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
