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
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/toast/sonner";
import Goingbackbtn from "@/components/GoBack/Goingbackbtn";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Topbar /> */}
        <main className="dark" suppressHydrationWarning>

          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset >

              <header className="header sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-black" style={{marginBottom:'8px'}}>
                <div className="flex items-center gap-2 px-3" style={{ color: "gray", zIndex:'999' }}>
                  <SidebarTrigger />
                </div>
                <Goingbackbtn white={true} />
              </header>

              <div className="flex gap-2 p-1">
                <section className="h-full w-full" style={{width:'-webkit-fill-available'}}>
                  <div className="w-full h-full">
                    <NextTopLoader />
                    {children}
                  </div>
                  <Toaster />
                </section>
              </div>

            </SidebarInset>
          </SidebarProvider>

        </main>
      </body>
      <link rel="stylesheet" precedence="default" href="https://use.typekit.net/izg8hnx.css"></link>
    </html>
  );
}