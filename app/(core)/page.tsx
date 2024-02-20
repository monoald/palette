import Link from "next/link";
import { randomBetween } from "../utils/randomBetween";
import { svgs } from "./font-icon/data/svg";
import Image from "next/image";
import Footer from "../components/Footer";

const palettes = [
  {
    palette: ["#8dc5cc", "#465366", "#db9f97", "#dbc197"],
    bg: 1,
    txt: 0,
    "btn-1-bg": 2,
    "btn-1-txt": 1,
    "btn-2-bg": 3,
    "btn-2-txt": 1,
  },
  {
    palette: ["#362127", "#6b333d", "#8c4047"],
    bg: 0,
    txt: 2,
    "btn-1-bg": 2,
    "btn-1-txt": 0,
    "btn-2-bg": 1,
    "btn-2-txt": 0,
  },
  {
    palette: ["#0b6674", "#b69425", "#362127"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 1,
    "btn-1-txt": 2,
    "btn-2-bg": 2,
    "btn-2-txt": 1,
  },
  {
    palette: ["#d8ebf3", "#0a151e", "#1a344c", "#2b4b69"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 2,
    "btn-1-txt": 0,
    "btn-2-bg": 3,
    "btn-2-txt": 0,
  },
  {
    palette: ["#0a0a19", "#cdcdfe", "#fefecd"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 1,
    "btn-1-txt": 0,
    "btn-2-bg": 2,
    "btn-2-txt": 0,
  },
  {
    palette: ["#010b13", "#d3f1fd", "#031e2b"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 2,
    "btn-1-txt": 1,
    "btn-2-bg": 1,
    "btn-2-txt": 0,
  },
  {
    palette: ["#0e353e", "#3e180e", "#64351b"],
    bg: 1,
    txt: 2,
    "btn-1-bg": 0,
    "btn-1-txt": 2,
    "btn-2-bg": 2,
    "btn-2-txt": 1,
  },
  {
    palette: ["#57cefa", "#fa57ce", "#cefa57", "#f7cfe9", "#0e353e"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 2,
    "btn-1-txt": 4,
    "btn-2-bg": 3,
    "btn-2-txt": 4,
  },
  {
    palette: ["#252c02", "#889343", "#cecfc4"],
    bg: 0,
    txt: 2,
    "btn-1-bg": 1,
    "btn-1-txt": 0,
    "btn-2-bg": 2,
    "btn-2-txt": 0,
  },
  {
    palette: ["#d69c5a", "#d2d65a", "#568dcc", "#2d2b66"],
    bg: 3,
    txt: 1,
    "btn-1-bg": 0,
    "btn-1-txt": 3,
    "btn-2-bg": 2,
    "btn-2-txt": 3,
  },
  {
    palette: ["#210302", "#631c08", "#084f63"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 1,
    "btn-1-txt": 0,
    "btn-2-bg": 2,
    "btn-2-txt": 0,
  },
  {
    palette: ["#51e6c8", "#092018", "#138165", "#e6516f"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 2,
    "btn-1-txt": 1,
    "btn-2-bg": 3,
    "btn-2-txt": 1,
  },
  {
    palette: ["#a36552", "#462f2a", "#5290a3", "#69453f"],
    bg: 0,
    txt: 1,
    "btn-1-bg": 2,
    "btn-1-txt": 1,
    "btn-2-bg": 3,
    "btn-2-txt": 0,
  },
];

const gradients = [
  "linear-gradient(220deg, #8479a9 0%, #343054 50%, #1c1631 100%)",
  "radial-gradient(circle at 50% 50%, #064c6a 0%, #03293a 83%)",
  "radial-gradient(circle at 47% 115%, #a654c0 0%, #8654c0 50%, #6054c0 100%)",
  "conic-gradient(#04549a 0%, #2e9bfa 100%)",
  "linear-gradient(11deg, #525be0 0%, #528be0 50%, #52e0a3 100%)",
  "radial-gradient(circle at 127% 4%, #e4c8e1 0%, #c9a6c8 100%)",
  "radial-gradient(circle at 50% 50%, #9c1621 0%, #6f111a 51%, #410c16 89%)",
  "linear-gradient(245deg, #bc312f 0%, #a0272d 50%, #2b030a 100%)",
  "conic-gradient(#be7cf3 0%, #340859 50%, #610fa3 100%)",
  "conic-gradient(#7898d9 1%, #78afd9 100%)",
  "conic-gradient(#080684 0%, #0c09b9 50%, #1e1af4 100%)",
  "linear-gradient(90deg, #c47d3b 0%, #c43b4b 50%, #c43b6b 100%)",
  "linear-gradient(329deg, #930fae 0%, #5f0d77 50%, #270731 100%)",
  "conic-gradient(#fdceda 0%, #da073b 50%, #fa6187 100%)",
  "conic-gradient(#463441 0%, #140b12 100%)",
  "radial-gradient(circle at 97% -14%, #012400 0%, #3bfe34 50%, #8efe8a 100%)",
];

export default function Home() {
  const palette = palettes[randomBetween(0, palettes.length - 1)];
  const gradient = gradients[randomBetween(0, gradients.length - 1)];
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
          <section className="flex flex-col gap-4">
            <div
              className="w-full mx-auto p-8 border border-secondary-border rounded-3xl flex flex-col gap-8"
              style={{ background: palette.palette[palette.bg] }}
            >
              <p
                className="text-6xl font-extrabold text-center text-balance"
                style={{ color: palette.palette[palette.txt] }}
              >
                Find the perfect palette for your project
              </p>

              <div className="w-fit mx-auto flex gap-4">
                <Link
                  href="/palette/craft"
                  className="rounded-lg w-32 h-10 font-semibold flex items-center justify-center"
                  style={{
                    background: palette.palette[palette["btn-1-bg"]],
                    color: palette.palette[palette["btn-1-txt"]],
                  }}
                >
                  start
                </Link>{" "}
                <Link
                  href="/login"
                  className="rounded-lg w-32 h-10 font-semibold flex items-center justify-center"
                  style={{
                    background: palette.palette[palette["btn-2-bg"]],
                    color: palette.palette[palette["btn-2-txt"]],
                  }}
                >
                  login
                </Link>
              </div>
            </div>

            <div className="w-full h-96 flex gap-2">
              {palette.palette.map((clr) => (
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
              <p className="text-6xl font-extrabold text-center text-balance">
                Discover amazing gradients
              </p>
              <Link
                href="/gradient/craft"
                className="relative w-fit py-3 px-10 text-secondary z-[0] before:absolute before:inset-1 before:rounded-3xl before:bg-main before:-z-[1] after:absolute after:rounded-3xl after:inset-0 after:[background-image:var(--ffrr)] after:-z-[2]"
                style={{ "--ffrr": gradient } as React.CSSProperties}
              >
                start
              </Link>
            </div>

            <div className="w-full h-fit border border-secondary-border rounded-3xl overflow-hidden">
              <div
                className="w-full h-[450px]"
                style={{ background: gradient }}
              ></div>
            </div>
          </section>

          <section className="flex flex-col gap-14">
            <p className="text-6xl font-extrabold text-center text-balance">
              Make font icons for your apps
            </p>

            <div className="flex flex-col items-center gap-4">
              <Image
                className="icon__svg"
                width={36}
                height={36}
                src={`data:image/svg+xml;base64,${btoa(
                  unescape(encodeURIComponent(icon.content))
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
              {icons.map((svg) => (
                <Image
                  key={svg.name}
                  className="icon__svg"
                  width={36}
                  height={36}
                  src={`data:image/svg+xml;base64,${btoa(
                    unescape(encodeURIComponent(svg.content))
                  )}`}
                  alt={`icon ${svg.name}`}
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
