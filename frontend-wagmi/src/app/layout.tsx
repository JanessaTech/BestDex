import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import WebMenu from "@/components/menu/WebMenu";
import { CoreProvider } from "@/components/providers/CoreProvider";
import ContextUtilProvider from "@/components/providers/ContextUtilProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "The Best DEX in the world",
  description: "Powered by JanessaTech",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-title antialiased text-white bg-black`}
      >
        <Toaster richColors closeButton/>
        <CoreProvider>
          <ContextUtilProvider>
            <div className="flex w-full">
              <WebMenu/>
              <div className="grow">
                <Header/>
                <main className="main-margin">
                  {children}
                </main>
              </div>
            </div>
          </ContextUtilProvider>
        </CoreProvider>
      </body>
    </html>
  );
}
