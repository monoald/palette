"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { getMainContrastColor } from "@/app/utils/createColorObject";
import { useUserStore } from "@/store";
import { hexToRgb } from "colors-kit";
import Link from "next/link";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Page() {
  const palettes = useUserStore((state) => state.collections?.palettes);
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-20">
        <h1 className="text-lg font-semibold text-center">My Palettes</h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {palettes ? (
            <>
              {palettes.map((palette, index) => (
                <MotionDiv
                  key={palette.id}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: index * 0.1,
                    ease: "easeInOut",
                    duration: 0.3,
                  }}
                  viewport={{ amount: 0 }}
                >
                  <article className="flex flex-col gap-5">
                    <ul className="w-full h-36 flex rounded-3xl overflow-hidden">
                      {palette.colorsArr.map((color) => (
                        <li
                          key={color}
                          className="w-full hover:w-[130%] transition-all text-[0px] hover:text-base"
                        >
                          <button
                            className="w-full h-full"
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
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
                      <button
                        className="secondary-hover flex"
                        tooltip="true"
                        tooltip-content="Unsave"
                        tooltip-position="bottom"
                      >
                        <span className="icon-heart-filled" />
                      </button>

                      <div
                        className="w-fit h-fit"
                        tooltip="true"
                        tooltip-content="Edit"
                        tooltip-position="bottom"
                      >
                        <Link
                          href={`/palette/craft/${palette.colors}`}
                          className="secondary-hover flex"
                        >
                          <span className="icon-palette" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </MotionDiv>
              ))}
            </>
          ) : (
            <>
              <article className="flex flex-col gap-5">
                <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

                <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                </div>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

                <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                </div>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

                <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                </div>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

                <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                  <button className="secondary-hover flex">
                    <span className="icon-heart" />
                  </button>
                </div>
              </article>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
