import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dohsray | Real problems. Practical solutions.",
  description: "Dohsray: public products designed and built by Kao Vichet in Cambodia, each solving a real problem in communication, security, health and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="no-scrollbar"
      suppressHydrationWarning
    >
      <body className="no-scrollbar">{children}</body>
    </html>
  );
}
