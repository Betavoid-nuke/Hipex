import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import projectInfo from "../../CustomizingPlatform/information.json";
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

          <div className="flex">
            <section className="h-full w-full" style={{width:'-webkit-fill-available'}}>
              <div className="w-full h-full">
                {children}
              </div>
              <Toaster />
            </section>
          </div>

        </main>
      </body>
      <link rel="stylesheet" precedence="default" href="https://use.typekit.net/izg8hnx.css"></link>
    </html>
  );
}