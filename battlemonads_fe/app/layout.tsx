import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Battle Monads - Price-based Monster Battles",
  description: "Real-time price-based monster battles powered by Chainlink Data Feeds on Monad blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
