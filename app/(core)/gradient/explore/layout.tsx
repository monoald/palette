import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Explore Gradients",
    description:
      "Discover amazing gradients for your projects, use them in css, tailwind and more!",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
