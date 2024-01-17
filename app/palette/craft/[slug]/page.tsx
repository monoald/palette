"use client";

import { useEffect, useState } from "react";
import { makeColorPalette } from "colors-kit";

import { createColorObject } from "@/app/utils/createColorObject";
import { useKeyDown } from "@/app/hooks/useKeyDown";

import PalettePlayground from "./components/PalettePlayground";
import SideBar from "./components/SideBar";

export default function Home() {
  const [palette, setPalette] = useState<Palette>();

  useEffect(() => {
    const url = window.location.href.split("/");
    const urlPalette = url[url.length - 1];
    const newPalette = urlPalette.split("-").map((clr) => "#" + clr);

    const newColors = newPalette.map((clr) => {
      return createColorObject(clr, "hex");
    });

    setPalette({
      history: {
        data: [urlPalette],
        current: 0,
      },
      colors: newColors,
    });
  }, []);

  useKeyDown(() => {
    const newPalette = makeColorPalette({
      format: "hex",
      paletteType: "random",
      quantity: 5,
    }) as string[];

    const colors = newPalette.map((clr) => {
      return createColorObject(clr, "hex");
    });

    setPalette((prev) => {
      if (prev) {
        const newColors = [];

        for (const clrindex in prev.colors) {
          if (prev.colors[clrindex].isLocked) {
            newColors.push(prev.colors[clrindex]);
          } else {
            newColors.push(colors[clrindex]);
          }
        }

        const newUrl = newColors
          .map((clr) => clr.hex.replace("#", ""))
          .join("-");
        history.replaceState({}, "", newUrl);

        return {
          ...prev,
          colors: newColors,
          history: {
            data: [...prev.history.data, newUrl],
            current: prev.history.current++,
          },
        };
      }
    });
  }, ["Space"]);

  const onUpdate = (currentId: string, lastSwapedId: string, side: string) => {
    setPalette((prev) => {
      if (prev) {
        const newList = [...prev.colors];
        const currentIndex = newList.findIndex((clr) => clr.id === currentId);
        const element = newList.splice(currentIndex, 1)[0];

        let lastSwapedIndex = newList.findIndex(
          (element) => element.id === lastSwapedId
        );

        if (side === "left") {
          newList.splice(lastSwapedIndex, 0, element);
        } else {
          newList.splice(lastSwapedIndex + 1, 0, element);
        }
        const newUrl = newList.map((clr) => clr.hex.replace("#", "")).join("-");
        const newHistoryData = [...prev.history.data];
        newHistoryData.push(newUrl);

        history.replaceState({}, "", `${newUrl}`);

        return {
          ...prev,
          colors: newList,
          history: {
            data: newHistoryData,
            current: newHistoryData.length - 1,
          },
        };
      }
    });
  };

  const handleLockColor = (id: string) => {
    const clrIndex = palette?.colors.findIndex(
      (clr) => clr.id === id
    ) as number;

    setPalette((prev) => {
      if (prev) {
        const newColors = [...prev.colors];
        newColors[clrIndex] = {
          ...newColors[clrIndex],
          isLocked: !newColors[clrIndex].isLocked,
        };
        return {
          ...prev,
          colors: newColors,
        };
      }
    });
  };

  console.log(palette);

  return (
    <div className="flex flex-col-reverse h-[calc(100vh-74px)] gap-8 px-8 py-8 bg-main md:flex-row">
      <SideBar />
      <main className="w-full h-full">
        {palette && (
          <PalettePlayground onUpdate={onUpdate}>
            {palette.colors.map((clr) => (
              <article
                key={clr.id}
                id={clr.id}
                className="relative group w-full h-full rounded-3xl flex flex-row justify-end pr-5 items-center gap-3 md:flex-col md:justify-center md:pr-0"
                style={{ background: clr.hex }}
                data-draggable
              >
                <p className="absolute top-auto left-10 text-md font-[500] tracking-wider uppercase md:left-auto md:top-10 lg:text-xl">
                  {clr.hex}
                </p>

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
                  onClick={() => handleLockColor(clr.id)}
                  tooltip="true"
                  tooltip-content="Lock"
                  tooltip-position="bottom"
                >
                  {clr.isLocked ? (
                    <span className="icon-locked" />
                  ) : (
                    <span className="icon-unlocked" />
                  )}
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
              </article>
            ))}
          </PalettePlayground>
        )}
      </main>
    </div>
  );
}
