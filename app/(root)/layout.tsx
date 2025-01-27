import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import projectInfo from "../../CustomizingPlatform/information.json";
import { AppSidebar } from "@/components/shared/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: projectInfo.name,
  description: projectInfo.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Topbar /> */}
        <main>
        {/* style={{marginTop:"50px"}} */}

          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>

              <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                <div className="flex items-center gap-2 px-3">
                  <SidebarTrigger />
                </div>
              </header>

              <div className="flex gap-2 p-2">
                <section className="h-full">
                <div className="w-full h-full">{children}</div>
                </section>
              </div>

            </SidebarInset>

          </SidebarProvider>

        </main>
      </body>
    </html>
  );
}

