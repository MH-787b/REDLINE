import type { Metadata } from "next";
import { Anton, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REDLINE — Beyond the Event Horizon",
  description:
    "REDLINE. Clothing engineered at the edge of the void. Drop 01 — gravity optional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${plexMono.variable} antialiased`}>
      <body className="custom-cursor min-h-screen text-fg">{children}</body>
    </html>
  );
}
