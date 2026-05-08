import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/hooks/useAuth";

import { ReducedMotionProvider } from "@/lib/context/ReducedMotionContext";

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "TADS 1K Challenge",
  description: "Industrialize your hustle. Three months. One thousand dollars. Zero excuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        <ReducedMotionProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
