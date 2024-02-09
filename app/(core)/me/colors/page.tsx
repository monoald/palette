"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { getMainContrastColor } from "@/app/utils/createColorObject";
import { useUserStore } from "@/store";
import { hexToRgb } from "colors-kit";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Page() {
  const colors = useUserStore((state) => state.collections?.colors);
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-20">
        <h1 className="text-lg font-semibold text-center">My Colors</h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-16">
          {colors ? (
            <>
              {colors.map((clr, index) => (
                <MotionDiv
                  key={clr.id}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: index * 0.2,
                    ease: "easeInOut",
                    duration: 0.5,
                  }}
                  viewport={{ amount: 0 }}
                >
                  <article className="flex flex-col gap-5">
                    <div
                      className="w-full h-36 flex items-center justify-center rounded-3xl overflow-hidden text-[0px] hover:text-lg font-semibold transition-all"
                      style={{
                        background: "#" + clr.name,
                        color: getMainContrastColor(hexToRgb("#" + clr.name)),
                      }}
                    >
                      <p className="uppercase">{"#" + clr.name}</p>
                    </div>

                    <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl overflow-hidden">
                      <button
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

                <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl"></div>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

                <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl"></div>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

                <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl"></div>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

                <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl"></div>
              </article>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
