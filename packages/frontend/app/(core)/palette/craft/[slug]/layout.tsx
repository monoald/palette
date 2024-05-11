import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Craft Palette",
    description: "Discover amazing color palettes and colors for your projects",
    openGraph: {
      images: [
        `https://paleta-v3.vercel.app/api/og/palette?content=${params.slug}`,
      ],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
