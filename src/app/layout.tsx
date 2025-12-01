import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import GeistProviderClient from "@/providers/geist-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-provider";

// TODO: LIDAR COM A FALTA DE INTERNET

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aprenda refrigeração",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <GeistProviderClient>
            <main>{children}</main>
            <Toaster richColors theme="light" />
          </GeistProviderClient>
        </QueryProvider>

        <script src="https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js"></script>
      </body>
    </html>
  );
}
