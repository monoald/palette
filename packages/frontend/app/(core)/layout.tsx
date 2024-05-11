import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "../components/header/Header";
import Message from "../components/Message";
import OptionMessage from "../components/OptionMessage";
import User from "./components/User";

import "../globals.css";
import "../fontIcons.css";
import LoadingState from "../components/LoadingState";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paleta",
  description:
    "Find amazing color palettes, css gradients, colors and make your own font icons like fontawesome!",
  openGraph: {
    images: ["https://paleta-v3.vercel.app/og.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} bg-main text-secondary`}>
        <User>
          <Header />
          {children}
          <Message />
          <OptionMessage />
          <LoadingState />
        </User>
      </body>
    </html>
  );
}
