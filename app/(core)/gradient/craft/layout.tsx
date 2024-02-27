import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Craft Gradient",
    description: "Discover amazing css gradients for your projects",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
