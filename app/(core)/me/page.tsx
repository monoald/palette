"use client";
import { useUserStore } from "@/store";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const collections = useUserStore((state) => state.collections);
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-9">
        <h1 className="text-lg font-semibold text-center">My Collections</h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-16">
          {collections ? (
            <>
              {collections.colors.length > 0 ? (
                <Link href="/me/colors" className="flex flex-col gap-5">
                  <div
                    className="w-full h-36 flex rounded-3xl overflow-hidden"
                    style={{
                      background:
                        "#" +
                        collections.colors[collections.colors.length - 1].name,
                    }}
                  ></div>

                  <p className="text-center text-lg">Colors</p>
                </Link>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="w-full h-36 border border-primary-border rounded-3xl flex flex-col items-center justify-center overflow-hidden gap-4">
                    <p>You have no colors saved!</p>
                    <p>˙◠˙</p>
                  </div>

                  <Link
                    href="/colors/explore"
                    className="primary-button block mx-auto"
                  >
                    <div>
                      <span>Explore</span>
                      <div className="circle-12"></div>
                      <div className="circle-11"></div>
                      <div className="circle-10"></div>
                      <div className="circle-9"></div>
                      <div className="circle-8"></div>
                      <div className="circle-7"></div>
                      <div className="circle-6"></div>
                      <div className="circle-5"></div>
                      <div className="circle-4"></div>
                      <div className="circle-3"></div>
                      <div className="circle-2"></div>
                      <div className="circle-1"></div>
                    </div>
                  </Link>
                </div>
              )}

              {collections.gradients.length > 0 ? (
                <Link href="/me/gradients" className="flex flex-col gap-5">
                  <div
                    className="w-full h-36 flex rounded-3xl overflow-hidden"
                    style={{
                      background:
                        collections.gradients[collections.gradients.length - 1]
                          .style,
                    }}
                  ></div>
                  <p className="text-center text-lg">Gradients</p>
                </Link>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="w-full h-36 border border-primary-border rounded-3xl flex flex-col items-center justify-center overflow-hidden gap-4">
                    <p>You have no gradients saved!</p>
                    <p>˙◠˙</p>
                  </div>

                  <Link
                    href="/gradient/craft"
                    className="primary-button block mx-auto"
                  >
                    <div>
                      <span>Craft</span>
                      <div className="circle-12"></div>
                      <div className="circle-11"></div>
                      <div className="circle-10"></div>
                      <div className="circle-9"></div>
                      <div className="circle-8"></div>
                      <div className="circle-7"></div>
                      <div className="circle-6"></div>
                      <div className="circle-5"></div>
                      <div className="circle-4"></div>
                      <div className="circle-3"></div>
                      <div className="circle-2"></div>
                      <div className="circle-1"></div>
                    </div>
                  </Link>
                </div>
              )}

              {collections.palettes.length > 0 ? (
                <Link href="/me/palettes" className="flex flex-col gap-5">
                  <div className="w-full h-36 flex rounded-3xl overflow-hidden">
                    {collections.palettes[
                      collections.palettes.length - 1
                    ].colorsArr.map((color) => (
                      <div
                        key={color}
                        className="w-full h-full"
                        style={{
                          background: color,
                        }}
                      ></div>
                    ))}
                  </div>

                  <p className="text-center text-lg">Palettes</p>
                </Link>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="w-full h-36 border border-primary-border rounded-3xl flex flex-col items-center justify-center overflow-hidden gap-4">
                    <p>You have no palettes saved!</p>
                    <p>˙◠˙</p>
                  </div>

                  <Link
                    href="/palette/craft"
                    className="primary-button block mx-auto"
                  >
                    <div>
                      <span>Craft</span>
                      <div className="circle-12"></div>
                      <div className="circle-11"></div>
                      <div className="circle-10"></div>
                      <div className="circle-9"></div>
                      <div className="circle-8"></div>
                      <div className="circle-7"></div>
                      <div className="circle-6"></div>
                      <div className="circle-5"></div>
                      <div className="circle-4"></div>
                      <div className="circle-3"></div>
                      <div className="circle-2"></div>
                      <div className="circle-1"></div>
                    </div>
                  </Link>
                </div>
              )}

              {collections.icons.length > 0 ? (
                <Link href="/me/font-icons" className="flex flex-col gap-5">
                  <div className="w-full h-36 flex rounded-3xl overflow-hidden">
                    <Image
                      src={
                        collections.icons[collections.icons.length - 1]
                          .thumbnail
                      }
                      alt="Last font icon thumbnail"
                      className="w-full object-cover"
                      width={380}
                      height={164}
                    ></Image>
                  </div>

                  <p className="text-center text-lg">Font Icons</p>
                </Link>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="w-full h-36 border border-primary-border rounded-3xl flex flex-col items-center justify-center overflow-hidden gap-4">
                    <p>You have no font icons saved!</p>
                    <p>˙◠˙</p>
                  </div>

                  <Link
                    href="/font-icon/craft"
                    className="primary-button block mx-auto"
                  >
                    <div>
                      <span>Craft</span>
                      <div className="circle-12"></div>
                      <div className="circle-11"></div>
                      <div className="circle-10"></div>
                      <div className="circle-9"></div>
                      <div className="circle-8"></div>
                      <div className="circle-7"></div>
                      <div className="circle-6"></div>
                      <div className="circle-5"></div>
                      <div className="circle-4"></div>
                      <div className="circle-3"></div>
                      <div className="circle-2"></div>
                      <div className="circle-1"></div>
                    </div>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <article className="flex flex-col gap-5">
                <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
                <p className="text-transparent">Colors</p>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
                <p className="text-transparent">Gradients</p>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
                <p className="text-transparent">Palettes</p>
              </article>

              <article className="flex flex-col gap-5">
                <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
                <p className="text-transparent">Font Icons</p>
              </article>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
