import "../globals.css";
import "../fontIcons.css";
import Message from "../components/Message";
import LoadingState from "../components/LoadingState";

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
