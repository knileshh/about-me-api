import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "About Me API — Your identity, one API call away",
    template: "%s | About Me API",
  },
  description: "Create a personal API endpoint that returns your profile data. Perfect for AI tools, portfolio sites, and developer workflows.",
  keywords: ["API", "personal API", "developer profile", "AI context", "JSON profile", "portfolio", "about me"],
  authors: [{ name: "Nilesh Kumar" }],
  creator: "About Me API",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    siteName: "About Me API",
    title: "About Me API — Your identity, one API call away",
    description: "Create a personal API endpoint that returns your profile data. Perfect for AI tools, portfolio sites, and developer workflows.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "About Me API - Your Personal API Endpoint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me API — Your identity, one API call away",
    description: "Create a personal API endpoint that returns your profile data. Perfect for AI tools, portfolio sites, and developer workflows.",
    images: ["/twitter-image.png"],
    creator: "@knileshh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-foreground bg-background selection:bg-primary/20`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
