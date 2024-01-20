"use client";

import { useEffect, useState } from "react";
import { Palette as PaletteType } from "colors-kit";

import { createColorObject } from "@/app/utils/createColorObject";
import { useKeyDown } from "@/app/hooks/useKeyDown";
import {
  handleCreateNewPalette,
  handleLockColor,
  handleRemoveColor,
} from "@/app/utils/paletteHandlers";

import PalettePlayground from "./components/PalettePlayground";
import SideBar from "./components/SideBar";
import OptionBar from "./components/OptionBar";
import { replacePath } from "@/app/utils/urlState";
import { options } from "./data/options";

export default function Home({ params }: { params: { slug: string } }) {
  const [palette, setPalette] = useState<Palette>();
  const [paletteType, setPaletteType] = useState("random");
  const [colorBlind, setColorBlind] = useState(null);
  const [option, setOption] = useState<string>();

  useEffect(() => {
    window.addEventListener("custom:paletteChange", (e) => {
      const event = e as CustomEvent;
      if (event.detail.event === "palette-type") {
        setPaletteType(event.detail.paletteType);
      }
    });
  }, []);

  useEffect(() => {
    const urlPalette = params.slug;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useKeyDown(() => {
    const newColors = handleCreateNewPalette(
      palette?.colors as Color[],
      paletteType as PaletteType
    );

    const newUrl = newColors.map((clr) => clr.hex.replace("#", "")).join("-");
    replacePath(newUrl);

    const paletteChange = new CustomEvent("custom:paletteChange", {
      detail: { event: "space" },
    });

    window.dispatchEvent(paletteChange);

    setPalette((prev) => {
      if (prev)
        return {
          ...prev,
          colors: newColors,
          history: {
            data: [...prev.history.data, newUrl],
            current: prev.history.current++,
          },
        };
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
        replacePath(newUrl);

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

  const lockColor = (id: string) => {
    setPalette((prev) => {
      if (prev) {
        const newColors = handleLockColor(prev.colors, id);
        return {
          ...prev,
          colors: newColors,
        };
      }
    });
  };

  const removeColor = (id: string) => {
    if ((palette?.colors.length as number) <= 2) return;
    setPalette((prev) => {
      if (prev) {
        const newColors = handleRemoveColor(prev.colors, id);

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
  };

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row">
      <SideBar setOption={setOption} />
      <OptionBar options={options[option as string]} setOption={setOption} />
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
                  onClick={() => removeColor(clr.id)}
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
                  onClick={() => lockColor(clr.id)}
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
