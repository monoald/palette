"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { getMainContrastColor } from "@/app/utils/createBaseColorObject";
import { useUserStore } from "@/store";
import { hexToRgb } from "colors-kit";
import Link from "next/link";
import { BasicCollection } from "../action";
import { dispatch } from "../../hooks/useStateHandler";
import { handleUnsaveColor } from "../../handlers";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Page() {
  const colors = useUserStore((state) => state.collections?.colors);
  const token = useUserStore((state) => state.token);
  const updateColors = useUserStore((state) => state.updateColors);

  const unsaveColor = async (color: BasicCollection) => {
    await handleUnsaveColor(
      token!,
      color,
      updateColors,
      () => {
        dispatch("custom:unsaveColor", { name: color.name });
      },
      () => {
        dispatch("custom:saveColor", { name: color.name });
      }
    );
  };
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-20">
        <h1 className="text-lg font-semibold text-center">My Colors</h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {colors ? (
            <>
              {colors.map((clr, index) => (
                <MotionDiv
                  key={clr.id}
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
                    <Link
                      href={`/color/${clr.name}`}
                      className="w-full h-36 flex items-center justify-center rounded-3xl overflow-hidden text-[0px] hover:text-lg font-semibold transition-all"
                      style={{
                        background: "#" + clr.name,
                        color: getMainContrastColor(hexToRgb("#" + clr.name)),
                      }}
                    >
                      <p className="uppercase">{"#" + clr.name}</p>
                    </Link>

                    <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
                      <button
                        onClick={() => unsaveColor(clr)}
                        className="secondary-hover flex"
                        tooltip="true"
                        tooltip-content="Unsave"
                        tooltip-position="bottom"
                      >
                        <span className="icon-heart-filled" />
                      </button>
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
