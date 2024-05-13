"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import { Palette as PaletteType, Rgb, hexToRgb, rgbToHex } from "colors-kit";

import { createBaseColorObject } from "@/app/utils/createBaseColorObject";
import { replacePath } from "@/app/utils/urlState";
import { useKeyDown } from "@/app/(core)/hooks/useKeyDown";
import useStateHandler, { dispatch } from "@/app/(core)/hooks/useStateHandler";
import {
  handleAddColor,
  handleChangePalette,
  handleCreatePaletteFromUrl,
  handleGetColorBlind,
  handleGetFormats,
  handleLockColor,
  handleRemoveColor,
  handleUpdateColor,
} from "./handlers";

import { useUserStore } from "@/store";
import { options } from "./data/options";

import { ContrastCalculator } from "@/app/components/ContrastCalculator";
import { ImageColorExtractor } from "@/app/components/imageExtractor/ImageColorExtractor";
import { Picker } from "@/app/components/picker/Picker";
import PalettePlayground from "./components/PalettePlayground";
import SideBar from "./components/SideBar";
import OptionBar from "../../../../components/OptionBar";
import {
  handleSaveColor,
  handleSavePalette,
  handleUnsaveColor,
  handleUnsavePalette,
} from "@/app/(core)/handlers";
import { makeRandomID } from "@/app/utils/makeRandomID";
import { isPaletteSaved } from "./utils/isPaletteSaved";

export default function Home({ params }: { params: { slug: string } }) {
  // PALETTE MANAGEMENT
  const [palette, setPalette] = useState<Palette>();
  const [paletteType, setPaletteType] = useState("random");
  const [paletteTypeOpen, setPaletteTypeOpen] = useState(false);
  const [colorBlind, setColorBlind] = useState("none");
  const [colorBlindOpen, setColorBlindOpen] = useState(false);

  const token = useUserStore((state) => state.token);
  const colors = useUserStore((state) => state.collections?.colors);
  const palettes = useUserStore((state) => state.collections?.palettes);
  const updateColors = useUserStore((state) => state.updateColors);
  const updatePalettes = useUserStore((state) => state.updatePalettes);

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
        const url = updatedColors
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;
        const isSaved = isPaletteSaved(palettes, url);
        return { ...prev, colors: updatedColors, isSaved };
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
    const newColors = handleCreatePaletteFromUrl(url, colors);

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
    setTimeout(() => {
      dispatch("custom:updateMessage", {
        type: "general",
        message: "Press the spacebar to craft a new Palette!",
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const urlPalette = params.slug;

    setPalette((prev) => {
      if (prev) {
        const newColors = handleCreatePaletteFromUrl(
          prev.history.data[prev.history.current],
          colors
        );
        return {
          ...prev,
          isSaved: isPaletteSaved(
            palettes,
            prev.history.data[prev.history.current]
          ),
          colors: newColors,
        };
      }
      const newColors = handleCreatePaletteFromUrl(urlPalette, colors);
      return {
        history: {
          data: [urlPalette],
          current: 0,
        },
        colors: newColors,
        isSaved: isPaletteSaved(palettes, urlPalette),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, palettes]);

  const changePalette = () => {
    const newColors = handleChangePalette(
      palette?.colors as Color[],
      paletteType as PaletteType
    );

    const newUrl = newColors.map((clr) => clr.hex.replace("#", "")).join("-");
    replacePath(newUrl);

    setPalette((prev) => {
      if (prev)
        return {
          ...prev,
          colors: newColors,
          history: {
            data: [...prev.history.data, newUrl],
            current: prev.history.data.length,
          },
          isSaved: isPaletteSaved(palettes, newUrl),
        };
    });
  };

  useKeyDown(() => {
    changePalette();
  }, ["Space"]);

  const selectPaletteType = (selected: string) => {
    setPaletteType(selected);
  };

  const selectColorBlind = (selected: keyof ColorBlindSimulator) => {
    setPalette((prev) => {
      if (prev) {
        return { ...prev, colors: handleGetColorBlind(prev.colors, selected) };
      }
    });
    setColorBlind(selected);
  };

  const savePalette = async () => {
    if (!token) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: "You must login to save a palette!",
      });
      return;
    }

    if (palette) {
      if (palette.isSaved) {
        await handleUnsavePalette(
          token,
          {
            id: makeRandomID(),
            name: palette.history.data[palette.history.current],
            colorsArr: palette.history.data[palette.history.current]
              .split("-")
              .map((clr) => "#" + clr),
            length: palette?.colors.length,
          },
          updatePalettes
        );
      } else {
        await handleSavePalette(
          token,
          {
            id: makeRandomID(),
            name: palette.history.data[palette.history.current],
            colorsArr: palette.history.data[palette.history.current]
              .split("-")
              .map((clr) => "#" + clr),
            length: palette?.colors.length,
          },
          updatePalettes
        );
      }
    }
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
          isSaved: isPaletteSaved(palettes, newUrl),
        };
      }
    });
  };

  // COLOR MANAGEMENT

  const setCurrentColor = (id: string) => {
    setPalette((prev) => {
      if (prev) {
        const clrIndex = prev.colors.findIndex((clr) => clr.id === id);
        if (!prev.colors[clrIndex].formats) {
          const updatedColors = [...prev.colors];
          const updatedColor = handleGetFormats(prev.colors[clrIndex]);
          updatedColors.splice(clrIndex, 1, updatedColor);

          return { ...prev, currentColor: id, colors: updatedColors };
        } else {
          return { ...prev, currentColor: id };
        }
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
            current: prev.history.current + 1,
          },
          isSaved: isPaletteSaved(palettes, newUrl),
        };
      }
    });
  };

  const copyColor = (clr: string) => {
    navigator.clipboard.writeText(clr.replace("#", ""));
    dispatch("custom:updateMessage", {
      type: "success",
      message: "Color copied to clipboard",
    });
  };

  const saveColor = async (
    color: { name: string; id: string },
    saved: boolean
  ) => {
    if (!token) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: "You must login to save a color!",
      });
      return;
    }

    if (saved) {
      await handleUnsaveColor(token, color, updateColors);
    } else {
      await handleSaveColor(token, color, updateColors);
    }
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
          return {
            ...createBaseColorObject(clr),
            isLocked:
              prev.colors.find((color) => color.hex === clr)?.isLocked || false,
            isSaved: colors
              ? colors?.findIndex(
                  (color) => color.name === clr.replace("#", "")
                ) !== -1
              : false,
          };
        });

        return {
          ...prev,
          colors: newColors,
          history: {
            ...prev.history,
            current,
          },
          isSaved: isPaletteSaved(palettes, newUrl),
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
          return {
            ...createBaseColorObject(clr),
            isLocked:
              prev.colors.find((color) => color.hex === clr)?.isLocked || false,
            isSaved: colors
              ? colors?.findIndex(
                  (color) => color.name === clr.replace("#", "")
                ) !== -1
              : false,
          };
        });

        return {
          ...prev,
          colors: newColors,
          history: {
            ...prev.history,
            current,
          },
          isSaved: isPaletteSaved(palettes, newUrl),
        };
      }
    });
  };

  // IMG TO PALETTE
  const [openImg, setOpenImg] = useState(false);

  const toggleImg = () => {
    setOpenImg(!openImg);
  };

  //
  function combineColors(color1: Rgb, color2: Rgb) {
    const combinedColor = {
      r: Math.round((color1.r + color2.r) / 2),
      g: Math.round((color1.g + color2.g) / 2),
      b: Math.round((color1.b + color2.b) / 2),
    };

    return combinedColor;
  }

  function addColor(index: number) {
    const secondaryColorIndex = index + 1;

    const color1 =
      palette?.colors[index].formats?.rgb ||
      hexToRgb(palette?.colors[index].hex as string);
    const color2 =
      palette?.colors[secondaryColorIndex].formats?.rgb ||
      hexToRgb(palette?.colors[secondaryColorIndex].hex as string);

    const newColorRgb = combineColors(color1, color2);
    const newColor = rgbToHex(newColorRgb);

    setPalette((prev) => {
      if (prev) {
        const updatedColors = handleAddColor(newColor, index + 1, prev.colors);
        const url = updatedColors
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;
        const isSaved = isPaletteSaved(palettes, url);
        replacePath(url);
        return {
          ...prev,
          colors: updatedColors,
          isSaved,
          history: {
            data: [...prev.history.data, url],
            current: prev.history.data.length,
          },
        };
      }
    });
  }

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row overflow-hidden">
      {palette && (
        <SideBar
          setPaletteTypeOpen={setPaletteTypeOpen}
          setColorBlindOpen={setColorBlindOpen}
          changePalette={changePalette}
          historyBack={historyBack}
          historyForward={historyForward}
          paletteHistory={palette.history}
          toggleImg={toggleImg}
          savePalette={savePalette}
          isPaletteSaved={palette.isSaved}
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
            {palette.colors.map((clr, index) => (
              <article
                key={clr.id}
                id={clr.id}
                className="relative group/main w-full h-full rounded-3xl flex flex-row flex-wrap justify-end max-[606px]:justify-center items-center gap-3 max-color-bar:gap-y-0 select-none md:flex-col md:justify-center md:pr-0"
                style={{ background: clr.hex }}
                onPointerMove={handleResize}
                onPointerUp={handleEndResize}
                data-draggable
              >
                {colorBlind !== "none" && clr.colorBlind && (
                  <div
                    ref={clrBlindRef}
                    className={`absolute top-0 left-0 w-full h-1/2 rounded-t-3xl ${
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

                {index + 1 !== palette.colors.length && (
                  <div className="absolute top-0 w-[60px] h-full -right-[36px] z-[1] group/plus flex items-center">
                    <button
                      className="w-[60px] h-[60px] hidden rounded-full bg-main group-hover/plus:flex items-center justify-center"
                      onClick={() => addColor(index)}
                    >
                      <span className="icon-plus text-2xl" />
                    </button>
                  </div>
                )}

                <p
                  className="max-[606px]:hidden absolute top-auto left-10 text-md font-[500] tracking-wider uppercase md:left-auto md:top-10 lg:text-xl"
                  style={{
                    color: clr.contrastColor,
                  }}
                >
                  {clr.hex}
                </p>

                <button
                  className="text-2xl hidden p-3 group-hover/main:flex"
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
                  className="text-2xl hidden p-3 group-hover/main:flex color-like"
                  style={{
                    color: clr.contrastColor,
                  }}
                  onClick={() =>
                    saveColor(
                      { name: clr.hex.replace("#", ""), id: clr.id },
                      clr.isSaved
                    )
                  }
                  tooltip="true"
                  tooltip-content="Save"
                  tooltip-position="bottom"
                >
                  <span
                    className={`${
                      clr.isSaved ? "icon-heart-filled" : "icon-heart"
                    }`}
                  />
                </button>

                <button
                  className="text-2xl hidden p-3 group-hover/main:flex"
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
                  className="text-2xl hidden p-3 group-hover/main:flex"
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
                  className="text-2xl hidden p-3 group-hover/main:flex cursor-grab"
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
                  className="text-2xl hidden p-3 group-hover/main:flex"
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
                  className="text-2xl hidden p-3 group-hover/main:flex"
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
