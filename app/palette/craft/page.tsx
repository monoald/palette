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
    <div className="grid grid-cols-[auto_1fr] h-[calc(100vh-74px)] gap-8 px-8 py-8 bg-main">
      <SideBar />
      <main className="w-full h-full">
        {palette && (
          <PalettePlayground arr={palette.colors} onUpdate={onUpdate}>
            {palette.colors.map((element) => (
              <article
                key={element.id}
                id={element.id}
                className="group w-full h-full rounded-3xl flex flex-col justify-center items-center gap-12"
                style={{ background: element.hex }}
                data-draggable
              >
                <p className="absolute top-10 text-xl font-[500] tracking-wider uppercase">
                  {element.hex}
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    className="text-2xl hidden p-3 group-hover:flex"
                    // style={{
                    //   'color': color.contrastColor
                    // }}
                    // onMouseDown={() => handleRemoveColor(color.id)}
                    tooltip="true"
                    tooltip-content="Remove"
                    tooltip-position="bottom"
                  >
                    <span className="icon-x" />
                  </button>

                  <button
                    className="text-2xl hidden p-3 group-hover:flex color-like"
                    // style={{
                    //   'color': color.contrastColor
                    // }}
                    data-tooltip
                    // data-name={color.color.substring(1)}
                    // data-saved={isSaved}
                    // data-id={savedId}
                    tooltip="true"
                    tooltip-content="Save"
                    tooltip-position="bottom"
                  >
                    <span
                      // className={`
                      //   icon
                      //   icon-heart${isSaved ? '-filled' : ''}
                      // `}
                      className="icon-heart"
                    />
                  </button>

                  <button
                    className="text-2xl hidden p-3 group-hover:flex"
                    // style={{
                    //   'color': color.contrastColor
                    // }}
                    // onMouseDown={handleCopyToClipboard}
                    tooltip="true"
                    tooltip-content="Add to clipboard"
                    tooltip-position="bottom"
                  >
                    <span className="icon-clipboard" />
                  </button>

                  <button
                    className="text-2xl hidden p-3 group-hover:flex"
                    // style={{
                    //   'color': color.contrastColor
                    // }}
                    // onMouseDown={handleLockColor}
                    tooltip="true"
                    tooltip-content="Lock"
                    tooltip-position="bottom"
                  >
                    {/* {color.isLocked */}
                    {/* ? */}
                    <span className="icon-unlocked" />
                    {/* : <span className='icon-lock-open' /> */}
                    {/* } */}
                  </button>

                  <button
                    className="text-2xl hidden p-3 group-hover:flex cursor-grab"
                    // style={{
                    // 'color': color.contrastColor
                    // }}
                    // {...listeners}
                    tooltip="true"
                    tooltip-content="Move"
                    tooltip-position="bottom"
                    data-drag-trigger
                  >
                    <span className="icon-move" />
                  </button>

                  <button
                    className="text-2xl hidden p-3 group-hover:flex"
                    // style={{
                    // 'color': color.contrastColor
                    // }}
                    // onMouseDown={handleContrast}
                    tooltip="true"
                    tooltip-content="Contrast calculator"
                    tooltip-position="bottom"
                  >
                    <span className="icon-contrast" />
                  </button>

                  <button
                    className="text-2xl hidden p-3 group-hover:flex"
                    // style={{
                    //   'color': color.contrastColor
                    // }}
                    // onMouseDown={handleOpenPicker}
                    tooltip="true"
                    tooltip-content="Color picker"
                    tooltip-position="bottom"
                  >
                    <span className="icon-eye-dropper" />
                  </button>
                </div>
              </article>
            ))}
          </PalettePlayground>
        )}
      </main>
    </div>
  );
}
