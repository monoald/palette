import "../globals.css";
import "../fontIcons.css";
import Message from "../components/Message";
import LoadingState from "../components/LoadingState";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paleta",
  description:
    "Find amazing color palettes, css gradients, colors and make your own font icons like fontawesome!",
  openGraph: {
    images: ["/og.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Message />
        <LoadingState />
      </body>
    </html>
  );
}
