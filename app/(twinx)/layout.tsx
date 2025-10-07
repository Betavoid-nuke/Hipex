"use client";

import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/twinx/components/AppSidebar";

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
      <body style={{scrollbarWidth:'none'}}>

        <SidebarProvider>
          <div className="flex h-screen" style={{width:'-webkit-fill-available'}}>

            {/* 🧭 Sidebar Section */}
            <AppSidebar
              currentView="dashboard"
              onNavigate={(view) => console.log("Navigating to:", view)}
            />

            {/* 🧱 Main Content Section */}
            <section
              className="flex-1 flex flex-col p-2 overflow-auto"
              style={{ width: "-webkit-fill-available", scrollbarWidth:'none'}}
            >
              <NextTopLoader />
              <div className="w-full h-full">{children}</div>
              <Toaster />
            </section>

          </div>
        </SidebarProvider>
        
      </body>
    </html>
  );
}
