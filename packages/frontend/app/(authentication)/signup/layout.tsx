import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign up",
    description:
      "Create an account in Paleta, the best place to find color palettes, gradients, colors and font icons that you can use in html and css",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
