"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { useUserStore } from "@/store";
import Image from "next/image";
import Link from "next/link";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Page() {
  const icons = useUserStore((state) => state.collections?.fonticons);
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-20">
        <h1 className="text-lg font-semibold text-center">My Font Icons</h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {icons ? (
            <>
              {icons.map((icon, index) => (
                <MotionDiv
                  key={icon.id}
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
                    <p className="text-center text-base">{icon.name}</p>
                    <div className="w-full h-36 flex rounded-3xl overflow-hidden border border-secondary-border">
                      <Image
                        src={icon.thumbnail}
                        alt="Last font icon thumbnail"
                        className="w-full object-cover"
                        width={380}
                        height={164}
                      ></Image>
                    </div>

                    <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
                      <div
                        className="w-fit h-fit"
                        tooltip="true"
                        tooltip-content="Edit"
                        tooltip-position="bottom"
                      >
                        <Link
                          href={`/font-icon/edit/${icon.id}+${icon.name}`}
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
