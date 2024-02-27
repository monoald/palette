import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Explore Palettes",
    description: "Discover amazing color palettes and colors for your projects",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
