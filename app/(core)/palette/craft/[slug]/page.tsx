"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import { Palette as PaletteType } from "colors-kit";

import { createColorObject } from "@/app/utils/createColorObject";
import { useKeyDown } from "@/app/(core)/hooks/useKeyDown";
import {
  handleChangePalette,
  handleCreatePaletteFromUrl,
  handleLockColor,
  handleRemoveColor,
  handleUpdateColor,
} from "./utils/paletteHandlers";

import PalettePlayground from "./components/PalettePlayground";
import SideBar from "./components/SideBar";
import OptionBar from "../../../../components/OptionBar";
import { replacePath } from "@/app/utils/urlState";
import { options } from "./data/options";
import { Picker } from "@/app/components/picker/Picker";
import useStateHandler from "@/app/(core)/hooks/useStateHandler";
import { ContrastCalculator } from "@/app/components/ContrastCalculator";
import { ImageColorExtractor } from "@/app/components/imageExtractor/ImageColorExtractor";

export default function Home({ params }: { params: { slug: string } }) {
  // PALETTE MANAGEMENT
  const [palette, setPalette] = useState<Palette>();
  const [paletteType, setPaletteType] = useState("random");
  const [paletteTypeOpen, setPaletteTypeOpen] = useState(false);
  const [colorBlind, setColorBlind] = useState("none");
  const [colorBlindOpen, setColorBlindOpen] = useState(false);

  const updatePaletteFromPickerHandler = (e: Event) => {
    const event = e as CustomEvent;
    setPalette((prev) => {
      if (prev) {
        const updatedColors = handleUpdateColor(
          event.detail.id,
          event.detail.clr,
          event.detail.format,
          prev.colors as Color[]
        );
        return { ...prev, colors: updatedColors };
      }
    });
  };

  const updateHistoryFromPickerHandler = () => {
    setPalette((prev) => {
      if (prev) {
        const newUrl = prev.colors
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;

        replacePath(newUrl);
        return {
          ...prev,
          history: {
            data: [...prev.history.data, newUrl],
            current: prev.history.current + 1,
          },
        };
      }
    });
  };

  const updatePaletteFromImgHandler = (e: Event) => {
    const event = e as CustomEvent;
    const url = event.detail.url;
    const newColors = handleCreatePaletteFromUrl(url);

    setPalette((prev) => {
      if (prev)
        return {
          ...prev,
          colors: newColors,
          history: {
            data: [...prev.history.data, url],
            current: prev.history.current + 1,
          },
        };
    });
    replacePath(url);
  };

  useStateHandler(
    [
      updatePaletteFromPickerHandler,
      updateHistoryFromPickerHandler,
      updatePaletteFromImgHandler,
    ],
    [
      "custom:updatePaletteFromPicker",
      "custom:updateHistoryFromPicker",
      "custom:updatePaletteFromImg",
    ]
  );

  useEffect(() => {
    const urlPalette = params.slug;

    const newColors = handleCreatePaletteFromUrl(urlPalette);

    setPalette({
      history: {
        data: [urlPalette],
        current: 0,
      },
      colors: newColors,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePalette = () => {
    const newColors = handleChangePalette(
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
            current: prev.history.current + 1,
          },
        };
    });
  };

  useKeyDown(() => {
    changePalette();
  }, ["Space"]);

  const selectPaletteType = (selected: string) => {
    setPaletteType(selected);
  };

  const selectColorBlind = (selected: string) => {
    setColorBlind(selected);
  };

  // COLOR BLIND RESIZE
  const [heightColorBlind, setHeightColorBlind] = useState<string | number>(
    "50%"
  );
  const [resizeColorBlind, setResizeColorBlind] = useState(false);
  const clrBlindRef = useRef<HTMLDivElement>(null);

  function handleStartResize() {
    setResizeColorBlind(true);
  }

  function handleResize(event: PointerEvent<HTMLDivElement>) {
    if (resizeColorBlind) {
      const target = clrBlindRef.current as HTMLDivElement;
      const clientTop = target.getBoundingClientRect().top;
      const mouseY = event.clientY - clientTop;
      setHeightColorBlind(mouseY);
    }
  }

  function handleEndResize() {
    setResizeColorBlind(false);
  }

  // SWAP
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

  // COLOR MANAGEMENT

  const setCurrentColor = (id: string) => {
    setPalette((prev) => {
      if (prev) return { ...prev, currentColor: id };
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

  const copyColor = (clr: string) => {
    navigator.clipboard.writeText(clr.replace("#", ""));
  };

  const closePicker = () => {
    setPalette((prev) => {
      if (prev)
        return {
          ...prev,
          currentColor: undefined,
        };
    });
  };

  // CONTRAST
  const [contrast, setContrast] = useState<number | null>(null);

  const openContrast = (id: string) => {
    const index = palette?.colors.findIndex((clr) => clr.id === id) as number;
    setContrast(index);
  };

  const closeContrast = () => {
    setContrast(null);
  };

  // HISTORY MANAGEMENT
  const historyBack = () => {
    setPalette((prev) => {
      if (prev) {
        const current = prev.history.current - 1;
        const newUrl = prev.history.data[current];
        replacePath(newUrl);

        const newPalette = newUrl.split("-").map((clr) => "#" + clr);

        const newColors = newPalette.map((clr) => {
          return createColorObject(clr, "hex");
        });

        return {
          ...prev,
          colors: newColors,
          history: {
            ...prev.history,
            current,
          },
        };
      }
    });
  };

  const historyForward = () => {
    setPalette((prev) => {
      if (prev) {
        const current = prev.history.current + 1;
        const newUrl = prev.history.data[current];
        replacePath(newUrl);

        const newPalette = newUrl.split("-").map((clr) => "#" + clr);

        const newColors = newPalette.map((clr) => {
          return createColorObject(clr, "hex");
        });

        return {
          ...prev,
          colors: newColors,
          history: {
            ...prev.history,
            current,
          },
        };
      }
    });
  };

  // IMG TO PALETTE
  const [openImg, setOpenImg] = useState(false);

  const toggleImg = () => {
    setOpenImg(!openImg);
  };

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row">
      {palette && (
        <SideBar
          setPaletteTypeOpen={setPaletteTypeOpen}
          setColorBlindOpen={setColorBlindOpen}
          changePalette={changePalette}
          historyBack={historyBack}
          historyForward={historyForward}
          paletteHistory={palette.history}
          toggleImg={toggleImg}
        />
      )}
      <OptionBar
        open={paletteTypeOpen}
        setOpen={setPaletteTypeOpen}
        options={options["palette-type"].options}
        current={paletteType}
        selectOption={selectPaletteType}
      />
      <OptionBar
        open={colorBlindOpen}
        setOpen={setColorBlindOpen}
        options={options["color-blind"].options}
        current={colorBlind}
        selectOption={selectColorBlind}
      />
      {openImg && <ImageColorExtractor toggleImg={toggleImg} />}
      {contrast !== null && (
        <ContrastCalculator
          currentIndex={contrast as number}
          colors={palette?.colors as Color[]}
          close={closeContrast}
        />
      )}
      <Picker
        clr={palette?.colors.find((clr) => clr.id === palette.currentColor)}
        closePicker={closePicker}
      />
      <main className="w-full h-full">
        {palette && (
          <PalettePlayground onUpdate={onUpdate}>
            {palette.colors.map((clr) => (
              <article
                key={clr.id}
                id={clr.id}
                className="relative group w-full h-full rounded-3xl flex flex-row justify-end pr-5 items-center gap-3 overflow-hidden select-none md:flex-col md:justify-center md:pr-0"
                style={{ background: clr.hex }}
                onPointerMove={handleResize}
                onPointerUp={handleEndResize}
                data-draggable
              >
                {colorBlind !== "none" && (
                  <div
                    ref={clrBlindRef}
                    className={`absolute top-0 left-0 w-full h-1/2 ${
                      clr ? `block` : "hidden"
                    }`}
                    style={{
                      background:
                        clr.colorBlind[colorBlind as keyof ColorBlindSimulator],
                      height: heightColorBlind,
                    }}
                  >
                    <div
                      className="absolute -bottom-3 w-full h-6 cursor-row-resize"
                      onPointerDown={handleStartResize}
                    ></div>
                  </div>
                )}

                <p
                  className="absolute top-auto left-10 text-md font-[500] tracking-wider uppercase md:left-auto md:top-10 lg:text-xl"
                  style={{
                    color: clr.contrastColor,
                  }}
                >
                  {clr.hex}
                </p>

                <button
                  className="text-2xl hidden p-3 group-hover:flex"
                  style={{
                    color: clr.contrastColor,
                  }}
                  onClick={() => removeColor(clr.id)}
                  tooltip="true"
                  tooltip-content="Remove"
                  tooltip-position="bottom"
                >
                  <span className="icon-x" />
                </button>

                <button
                  className="text-2xl hidden p-3 group-hover:flex color-like"
                  style={{
                    color: clr.contrastColor,
                  }}
                  tooltip="true"
                  tooltip-content="Save"
                  tooltip-position="bottom"
                >
                  <span className="icon-heart" />
                </button>

                <button
                  className="text-2xl hidden p-3 group-hover:flex"
                  style={{
                    color: clr.contrastColor,
                  }}
                  onClick={() => copyColor(clr.hex)}
                  tooltip="true"
                  tooltip-content="Add to clipboard"
                  tooltip-position="bottom"
                >
                  <span className="icon-clipboard" />
                </button>

                <button
                  className="text-2xl hidden p-3 group-hover:flex"
                  style={{
                    color: clr.contrastColor,
                  }}
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
                  style={{
                    color: clr.contrastColor,
                  }}
                  tooltip="true"
                  tooltip-content="Move"
                  tooltip-position="bottom"
                  data-drag-trigger
                >
                  <span className="icon-move" />
                </button>

                <button
                  className="text-2xl hidden p-3 group-hover:flex"
                  style={{
                    color: clr.contrastColor,
                  }}
                  onClick={() => openContrast(clr.id)}
                  tooltip="true"
                  tooltip-content="Contrast calculator"
                  tooltip-position="bottom"
                >
                  <span className="icon-contrast" />
                </button>

                <button
                  className="text-2xl hidden p-3 group-hover:flex"
                  style={{
                    color: clr.contrastColor,
                  }}
                  onClick={() => setCurrentColor(clr.id)}
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
