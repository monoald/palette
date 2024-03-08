import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Color #${params.slug}`,
    description: `Discover the representaion of #${params.slug} color in hsv, hsl, rgb, lab, and xyz, watch the color palettes you can create with it like the analogous, complementary, monochromatic, split-complementary, square, tetradic and triadic palettes also you can see how people with different color blindness like achromatomaly, achromatopsia, deuteranomaly, deuteranopia, protanomaly, protanopia, tritanomaly and tritanopia see this color.`,
    openGraph: {
      images: [
        `https://paleta-v3.vercel.app/api/og/color?content=${params.slug}`,
      ],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
