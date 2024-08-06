import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MenuHome from "@/components/menu/MenuHome";
import HeaderHome from "@/components/header/HeaderHome";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} text-white bg-black`}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          > */}
            <div className="flex w-full">
              <MenuHome/>
              <div className="grow">
                <div className="padding-y">
                  <HeaderHome/>
                  <main>
                    {children}
                  </main>
                </div> 
              </div>
            </div>     
        {/* </ThemeProvider>  */}
      </body>
    </html>
  );
}
