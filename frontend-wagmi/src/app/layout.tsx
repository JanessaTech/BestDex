import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import Menu from "@/components/menu/Menu";
import Header from "@/components/header/Header";

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
        <Providers>
          <div className="flex w-full">
            <Menu/>
            <div className="grow">
              <Header/>
              <main className="main-margin">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
