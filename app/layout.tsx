import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HearSpace",
  description: "AI-generated atmosphere memories from everyday spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
