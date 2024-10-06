import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Viewport } from 'next'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
      template: '%s | Artverse',
      default: 'Artverse', // a default is required when creating a template
    },
  }

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
