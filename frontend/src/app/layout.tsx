import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Palm Island Storm Stories - When the Waters Rose, Community Strength Emerged",
  description: "Authentic voices from Palm Island community members sharing their experiences during the February 2025 storm. Stories of resilience, innovation, and collective care in the face of climate challenges.",
  keywords: "Palm Island, Indigenous community, climate resilience, community stories, storm recovery, Bwgcolman, PICC",
  authors: [{ name: "Palm Island Community Company" }],
  openGraph: {
    title: "Palm Island Storm Stories",
    description: "Community voices sharing stories of resilience during the February 2025 storm on Palm Island",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palm Island Storm Stories",
    description: "Community voices sharing stories of resilience during the February 2025 storm",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;1,400;1,700&family=Montserrat:wght@300;400;600;700;800&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ margin: 0, padding: 0 }}>
        <Navigation />
        <PageWrapper>
          {children}
        </PageWrapper>
      </body>
    </html>
  );
}
