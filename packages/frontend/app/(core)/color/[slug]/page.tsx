"use client";

import { ColorFormats, hexToRgb } from "colors-kit";

import { ColorBlind, Palettes, createColor } from "./utils/createSingleColor";
import { getMainContrastColor } from "@/app/utils/createBaseColorObject";
import Link from "next/link";
import { useUserStore } from "@/store";
import { useEffect, useState } from "react";
import { dispatch } from "../../hooks/useStateHandler";
import { handleSaveColor, handleUnsaveColor } from "../../handlers";
import { makeRandomID } from "@/app/utils/makeRandomID";

export default function Page({ params }: { params: { slug: string } }) {
  const [color, setColor] = useState(createColor(params.slug));
  const colors = useUserStore((state) => state.collections?.colors);
  const token = useUserStore((state) => state.token);
  const updateColors = useUserStore((state) => state.updateColors);

  useEffect(() => {
    setColor((prev) => ({
      ...prev,
      saved: colors
        ? Boolean(colors.find((clr) => clr.name === params.slug))
        : false,
    }));
  }, [colors, params.slug]);

  const saveColor = async () => {
    if (!token) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: "You must login to save a color!",
      });
      return;
    }

    if (color.saved) {
      await handleUnsaveColor(
        token,
        { name: params.slug, id: makeRandomID() },
        updateColors
      );
    } else {
      await handleSaveColor(
        token,
        { name: params.slug, id: makeRandomID() },
        updateColors
      );
    }
  };

  return (
    <div className="w-full h-auto bg-main">
      <main className="max-w-5xl p-8 flex flex-col gap-20 bg-main mx-auto">
        <div className="flex flex-col gap-10">
          <div
            className="w-full h-96 rounded-3xl mx-auto border border-secondary-border flex items-center justify-center"
            style={{ background: color.color, color: color.mainContrastColor }}
          >
            <h1 className="text-5xl font-semibold text-center uppercase opacity-80">
              {color.color}
            </h1>
          </div>

          <div className="w-fit h-fit px-10 py-2 mx-auto border border-primary-border rounded-full flex items-center text-2xl">
            <button
              className="flex items-center justify-center"
              onClick={saveColor}
            >
              <span
                className={`${
                  color.saved ? "icon-heart-filled" : "icon-heart"
                } text-4xl`}
              />
            </button>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-center">Formats</h2>
          <div className="w-full flex justify-evenly pt-10 mx-auto">
            <div className="flex flex-col gap-4">
              {Object.keys(color.allFormats)
                .slice(0, 3)
                .map(
                  (format) =>
                    format !== "hex" && (
                      <div key={format} className="flex justify-between gap-10">
                        <p className="table__name">{format.toUpperCase()}</p>
                        <p className="table__value">
                          {Object.values(
                            color.allFormats[
                              format as keyof ColorFormats
                            ] as ColorFormats
                          ).join(", ")}
                        </p>
                      </div>
                    )
                )}
            </div>
            <div className="flex flex-col gap-4">
              {Object.keys(color.allFormats)
                .slice(3, 6)
                .map(
                  (format) =>
                    format !== "hex" && (
                      <div key={format} className="flex justify-between gap-10">
                        <p className="table__name">{format.toUpperCase()}</p>
                        <p className="table__value">
                          {Object.values(
                            color.allFormats[
                              format as keyof ColorFormats
                            ] as ColorFormats
                          ).join(", ")}
                        </p>
                      </div>
                    )
                )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-center">Basic Palettes</h2>

          <ul className="pt-10 grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-14">
            {Object.keys(color.palettes).map((palette) => (
              <li className="flex flex-col gap-5" key={color.color + palette}>
                <p className="capitalize text-center">{palette}</p>
                <ul className="w-full h-36 flex rounded-3xl overflow-hidden">
                  {color.palettes[palette as keyof Palettes].map((color) => (
                    <li
                      key={color}
                      className="w-full hover:w-[130%] transition-all text-[0px] hover:text-base"
                    >
                      <Link
                        href={`/color/${color.replace("#", "")}`}
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: color,
                        }}
                      >
                        <span
                          className="uppercase"
                          style={{
                            color: getMainContrastColor(hexToRgb(color)),
                          }}
                        >
                          {color}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
                  {/* <button
                    className="secondary-hover flex"
                    tooltip="true"
                    tooltip-content="Save"
                    tooltip-position="bottom"
                  >
                    <span
                      className={`
                      icon-heart
                    `}
                    />
                  </button> */}

                  <div
                    className="secondary-hover flex"
                    tooltip="true"
                    tooltip-content="Edit"
                    tooltip-position="bottom"
                  >
                    <Link
                      href={`/palette/craft/${color.palettes[
                        palette as keyof Palettes
                      ]
                        .join("-")
                        .replaceAll("#", "")}`}
                      className="flex items-center justify-center"
                    >
                      <span className="icon-palette" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-center">
            Color Blind Simulation
          </h2>

          <ul className="pt-10 grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-14">
            {Object.keys(color.colorBlind).map(
              (blindness: keyof ColorBlind) => (
                <li className="flex flex-col gap-5" key={blindness}>
                  <p className="capitalize text-center">{blindness}</p>

                  <Link
                    href={`/color/${color?.colorBlind[blindness].replace(
                      "#",
                      ""
                    )}`}
                    className="w-full h-36 flex items-center justify-center rounded-3xl overflow-hidden text-[0px] hover:text-lg font-semibold transition-all"
                    style={{
                      background: color?.colorBlind[blindness],
                      color: getMainContrastColor(
                        hexToRgb(color?.colorBlind[blindness])
                      ),
                    }}
                  >
                    <p className="uppercase">{color?.colorBlind[blindness]}</p>
                  </Link>

                  {/* <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
                    <button
                      className="secondary-hover flex"
                      tooltip="true"
                      tooltip-content="Save"
                      tooltip-position="bottom"
                    >
                      <span
                        className={`
                          icon-heart
                        `}
                      />
                    </button>
                  </div> */}
                </li>
              )
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
