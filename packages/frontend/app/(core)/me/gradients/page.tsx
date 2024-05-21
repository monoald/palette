"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { useUserStore } from "@/store";
import Link from "next/link";
import { handleUnsaveGradient } from "../../handlers";
import { GradientCollection } from "../action";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Page() {
  const gradients = useUserStore((state) => state.collections?.gradients);
  const token = useUserStore((state) => state.token);
  const updateGradients = useUserStore((state) => state.updateGradients);

  const unsaveGradient = async (gradient: GradientCollection) => {
    await handleUnsaveGradient(
      token!,
      gradient,
      updateGradients,
      () => {
        dispatch("custom:unsaveGradient", { name: gradient.name });
      },
      () => {
        dispatch("custom:saveGradient", { name: gradient.name });
      }
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-20">
        <h1 className="text-lg font-semibold text-center">My Gradients</h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {gradients ? (
            <>
              {gradients.map((grad, index) => (
                <MotionDiv
                  key={grad.id}
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
                    <div
                      className="w-full h-36 flex rounded-3xl overflow-hidden"
                      style={{ background: grad.style }}
                    ></div>

                    <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
                      <button
                        onClick={() => unsaveGradient(grad)}
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
                          href={`/gradient/craft/${grad.name}`}
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
function dispatch(arg0: string, arg1: { name: any }) {
  throw new Error("Function not implemented.");
}
