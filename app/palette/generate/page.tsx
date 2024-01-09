import PalettePlayground from "./components/PalettePlayground";
import { makeRandomID } from "@/app/utils/makeRandomID";

export default function Home() {
  const palette: Palette = {
    colors: [
      {
        hex: "#5d9a3c",
        formats: {
          cmyk: { c: 34, m: 35, y: 50, k: 45 },
          hsv: { h: 34, s: 35, v: 50 },
          hsl: { h: 34, s: 35, l: 50 },
          lab: { l: 34, a: 35, b: 50 },
          rgb: { r: 34, g: 35, b: 50 },
          xyz: { x: 34, y: 35, z: 50 },
          hex: "#5d9a3c",
        },
        isLocked: false,
        contrastColor: "#000000",
        id: makeRandomID(),
      },
      {
        hex: "#f8629a",
        formats: {
          cmyk: { c: 34, m: 35, y: 50, k: 45 },
          hsv: { h: 34, s: 35, v: 50 },
          hsl: { h: 34, s: 35, l: 50 },
          lab: { l: 34, a: 35, b: 50 },
          rgb: { r: 34, g: 35, b: 50 },
          xyz: { x: 34, y: 35, z: 50 },
          hex: "#f8629a",
        },
        isLocked: false,
        contrastColor: "#000000",
        id: makeRandomID(),
      },
      {
        hex: "#103785",
        formats: {
          cmyk: { c: 34, m: 35, y: 50, k: 45 },
          hsv: { h: 34, s: 35, v: 50 },
          hsl: { h: 34, s: 35, l: 50 },
          lab: { l: 34, a: 35, b: 50 },
          rgb: { r: 34, g: 35, b: 50 },
          xyz: { x: 34, y: 35, z: 50 },
          hex: "#103785",
        },
        isLocked: false,
        contrastColor: "#000000",
        id: makeRandomID(),
      },
      {
        hex: "#a8ad8c",
        formats: {
          cmyk: { c: 34, m: 35, y: 50, k: 45 },
          hsv: { h: 34, s: 35, v: 50 },
          hsl: { h: 34, s: 35, l: 50 },
          lab: { l: 34, a: 35, b: 50 },
          rgb: { r: 34, g: 35, b: 50 },
          xyz: { x: 34, y: 35, z: 50 },
          hex: "#a8ad8c",
        },
        isLocked: false,
        contrastColor: "#000000",
        id: makeRandomID(),
      },
      {
        hex: "#fe46fa",
        formats: {
          cmyk: { c: 34, m: 35, y: 50, k: 45 },
          hsv: { h: 34, s: 35, v: 50 },
          hsl: { h: 34, s: 35, l: 50 },
          lab: { l: 34, a: 35, b: 50 },
          rgb: { r: 34, g: 35, b: 50 },
          xyz: { x: 34, y: 35, z: 50 },
          hex: "#fe46fa",
        },
        isLocked: false,
        contrastColor: "#000000",
        id: makeRandomID(),
      },
      {
        hex: "#580512",
        formats: {
          cmyk: { c: 34, m: 35, y: 50, k: 45 },
          hsv: { h: 34, s: 35, v: 50 },
          hsl: { h: 34, s: 35, l: 50 },
          lab: { l: 34, a: 35, b: 50 },
          rgb: { r: 34, g: 35, b: 50 },
          xyz: { x: 34, y: 35, z: 50 },
          hex: "#580512",
        },
        isLocked: false,
        contrastColor: "#000000",
        id: makeRandomID(),
      },
    ],
  };
  return (
    <main className="w-full h-screen">
      <PalettePlayground palette={palette} />
    </main>
  );
}
