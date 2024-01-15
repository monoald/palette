"use client";

import { useEffect, useState } from "react";
import PalettePlayground from "./components/PalettePlayground";
import { makeRandomID } from "@/app/utils/makeRandomID";
import SideBar from "./components/SideBar";

export default function Home() {
  const [palette, setPalette] = useState<Palette>();

  useEffect(() => {
    setPalette({
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
    });
  }, []);

  const onUpdate = (updatedArr: any[]) => {
    setPalette((prev) => {
      return {
        ...prev,
        colors: updatedArr,
      };
    });
  };

  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[54px_1fr] gap-7 p-7 bg-main">
      <SideBar />
      <main className="w-full h-full">
        {palette && (
          <PalettePlayground arr={palette.colors} onUpdate={onUpdate}>
            {palette.colors.map((element) => (
              <article
                key={element.id}
                id={element.id}
                className="w-full h-full rounded-xl flex flex-col justify-center items-center gap-10"
                style={{ background: element.hex }}
                data-draggable
              >
                <p>{element.hex}</p>
                <button className="bg-slate-900 py-2 px-4" data-drag-trigger>
                  DRAG
                </button>
              </article>
            ))}
          </PalettePlayground>
        )}
      </main>
    </div>
  );
}
