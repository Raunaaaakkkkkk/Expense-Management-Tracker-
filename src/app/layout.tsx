import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Management",
  description: "Multi-tenant expense management for small companies, firms, and malls",
};

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const org = session?.user?.organizationId ? await prisma.organization.findUnique({ where: { id: session.user.organizationId } }) : null;
  const brand = org?.brandColor ?? "#6366f1";
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ '--brand': brand } as React.CSSProperties}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
