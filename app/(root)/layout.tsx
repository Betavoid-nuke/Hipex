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
  icons: {
    icon: '/logofin.ico', // or '/favicon.png' or whatever file you used
  }
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
        {/* style={{marginTop:"50px"}} */}

          <SidebarProvider>
            <AppSidebar />
            {/* style={{background:"#151419", color:"white"}} */}
            <SidebarInset >

              <header className="header sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-black">
                <div className="flex items-center gap-2 px-3" style={{ color: "gray", zIndex:'999' }}>
                  <SidebarTrigger />
                </div>
              </header>

              <div className="flex gap-2 p-2">
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












//the date picker in the create new project not woring probably linked to the color picker popover edit btn in the editor










