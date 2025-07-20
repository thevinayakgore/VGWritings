import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VGWritings - Thoughtful Blogs & Insights",
  description:
    "VGWritings is my personal blog sharing stories, learning posts, travelling diaries, career growth, and more. Explore insights, experiences, and tips from my journey.",
  keywords: [
    "VGWritings",
    "personal stories",
    "learning posts",
    "travelling diaries",
    "career growth",
    "self-improvement",
    "experiences",
    "insights",
    "personal blog",
    "technology",
    "productivity",
    "growth",
  ],
  authors: [{ name: "Vinayak Gore", url: "https://vgwritings.com" }],
  creator: "Vinayak Gore",
  openGraph: {
    title: "VGWritings – Thoughtful Blogs & Insights",
    description:
      "Explore insightful blogs and resources on technology, productivity, and personal growth.",
    url: "https://vgwritings.com",
    siteName: "VGWritings",
    images: [
      {
        url: "/og-image.png", // Place an SEO-friendly image in your public folder
        width: 1200,
        height: 630,
        alt: "VGWritings – Thoughtful Blogs & Insights",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VGWritings – Thoughtful Blogs & Insights",
    description:
      "Explore insightful blogs and resources on technology, productivity, and personal growth.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://vgwritings.com"),
  alternates: {
    canonical: "https://vgwritings.com",
  },
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
