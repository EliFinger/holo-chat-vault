import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "WhisperLink Messenger - Truly Private On-Chain Chat",
  description: "On-chain encrypted chat dApp where all messages are homomorphically secured and decrypted only by recipients.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[hsl(230,35%,7%)] text-[hsl(210,40%,98%)] antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
