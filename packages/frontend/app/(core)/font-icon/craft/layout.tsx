import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Craft Font Icons",
    description: "Craft your own font icon like fontawesome",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
