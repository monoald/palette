import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Craft Gradient",
    description: "Discover amazing css gradients for your projects",
    openGraph: {
      images: [
        `https://paleta-v3.vercel.app/api/og/gradient?content=${params.slug}`,
      ],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
