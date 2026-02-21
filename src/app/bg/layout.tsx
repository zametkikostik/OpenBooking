import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "OpenBooking - Decentralized Trust Economy Platform",
  description: "Book unique accommodations worldwide with crypto payments, escrow protection, and DeFi yield. The future of travel is here.",
  keywords: ["booking", "travel", "accommodation", "web3", "defi", "crypto payments", "vacation rental", "escrow"],
  authors: [{ name: "OpenBooking" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://openbooking.com",
    title: "OpenBooking - Trust Economy Platform",
    description: "Decentralized booking infrastructure combining Finance + AI Growth + Travel Economy",
    siteName: "OpenBooking",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenBooking",
    description: "Decentralized Trust Economy Platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
