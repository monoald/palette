"use client";
import Link from "next/link";
import { randomBetween } from "../utils/randomBetween";
import { svgs } from "./font-icon/data/svg";
import Image from "next/image";
import Footer from "../components/Footer";
import { makeColorPalette } from "colors-kit";
import { handleCraftGradient } from "./gradient/craft/[slug]/handlers";

export default function Home() {
  const palette = makeColorPalette({
    format: "hex",
    paletteType: "random",
    quantity: 4,
  }) as string[];
  const gradient = handleCraftGradient({ data: [], current: 0 });
  const icons = [];
  for (let i = 0; i < 56; i++) {
    const randomIndex = Math.floor(Math.random() * svgs.length);
    icons.push(svgs.splice(randomIndex, 1)[0]);
  }
  const icon = icons[randomBetween(0, icons.length - 1)];

  return (
    <>
      <main className="w-full p-8 bg-main h-fit">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-20">
          <section className="flex flex-col gap-8">
            <div className="w-full mx-auto flex flex-col gap-8">
              <p className="text-4xl md:text-6xl font-extrabold text-center text-balance">
                Find the perfect palette for your project
              </p>
              <Link
                href="/palette/craft"
                className="rounded-full w-32 h-10 mx-auto font-semibold border border-primary-border flex items-center justify-center"
              >
                start
              </Link>
            </div>

            <div className="w-full h-64 md:h-96 flex gap-2">
              {palette.slice(0, randomBetween(3, 4)).map((clr) => (
                <article
                  key={clr}
                  className="w-1/2 h-full border border-secondary-border rounded-3xl"
                  style={{ background: clr }}
                ></article>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-8">
              <p className="text-4xl md:text-6xl font-extrabold text-center text-balance">
                Discover amazing gradients
              </p>
              <Link
                href="/gradient/craft"
                className="w-32 h-10 border border-primary-border rounded-full text-secondary flex items-center justify-center"
              >
                start
              </Link>
            </div>

            <div className="w-full h-fit border border-secondary-border rounded-3xl overflow-hidden">
              <div
                className="w-full h-[450px]"
                style={{
                  background:
                    gradient[1].type + gradient[1].clrs + gradient[1].end,
                }}
              ></div>
            </div>
          </section>

          <section className="flex flex-col gap-14">
            <p className="text-4xl md:text-6xl font-extrabold text-center text-balance">
              Make font icons for your apps
            </p>

            <div className="flex flex-col items-center gap-4">
              <Image
                className="icon__svg"
                width={36}
                height={36}
                src={`data:image/svg+xml;base64,${btoa(
                  unescape(encodeURIComponent(icon.svg))
                )}`}
                alt={`icon ${icon.name}`}
              />

              <code className="w-fit p-8 bg-[#0D0D0D] rounded-3xl">
                &lt;<span className="text-[#c73028]">span</span>{" "}
                <span className="text-[#2E95D3]">class=</span>
                <span className="text-[#f6af3c]">&quot;</span>
                <span className="text-[#00A67D]">
                  icon-
                  {icon.name}
                </span>
                <span className="text-[#f6af3c]">&quot;</span> /&gt;
              </code>
            </div>

            <div className="flex flex-wrap justify-center gap-12 mt-4">
              {icons.map((icon) => (
                <Image
                  key={icon.name}
                  className="icon__svg"
                  width={36}
                  height={36}
                  src={`data:image/svg+xml;base64,${btoa(
                    unescape(encodeURIComponent(icon.svg))
                  )}`}
                  alt={`icon ${icon.name}`}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
