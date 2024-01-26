"use client";

import { makeRandomID } from "@/app/utils/makeRandomID";
import { setParam } from "@/app/utils/urlState";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AngleInput } from "./components/AngleInput";

export type Gradient = {
  type: string;
  angle: number | null;
  colors: { id: string; clr: string; stop: number }[];
};

export default function Page({ params }: { params: { slug: string } }) {
  const [gradient, setGradient] = useState<Gradient>();
  const [gradientStyle, setGradientStyle] = useState<string>();
  const [firstGradientBuild, setFirstGradientBuild] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    function createGradient(
      clrs: string,
      type: string | null | undefined,
      angle: string | null | undefined
    ) {
      const colors = clrs
        .split("-")
        .map((clr) => "#" + clr)
        .join(", ");
      let typeGradient = `linear-gradient(${angle || 90}deg, `;

      if (!angle) {
        if (type === "vertical") {
          typeGradient = "linear-gradient(0deg, ";
        } else if (type === "circle") {
          typeGradient = "radial-gradient(circle, ";
        } else if (type === "conic") {
          typeGradient = "conic-gradient(";
        }
      }

      return typeGradient + colors + ")";
    }

    const urlPalette = params.slug;
    const type = searchParams?.get("type") as string;
    const angle = searchParams?.get("angle") as string;

    setGradientStyle(createGradient(urlPalette, type, angle));
    setGradient({
      type,
      angle: +angle || null,
      colors: urlPalette
        .split("-")
        .map((clr) => ({ id: makeRandomID(), clr: "#" + clr, stop: 0 })),
    });
    setFirstGradientBuild(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function createGradientFromState() {
      const colors = gradient?.colors.map((clr) => clr.clr).join(", ");
      let typeGradient = `linear-gradient(${gradient?.angle ?? 90}deg, `;

      if (!gradient?.angle) {
        if (gradient?.type === "vertical") {
          typeGradient = "linear-gradient(0deg, ";
        } else if (gradient?.type === "circle") {
          typeGradient = "radial-gradient(circle, ";
        } else if (gradient?.type === "conic") {
          typeGradient = "conic-gradient(";
        }
      }

      return typeGradient + colors + ")";
    }
    if (gradient && firstGradientBuild) {
      setGradientStyle(createGradientFromState());
    }
  }, [firstGradientBuild, gradient]);

  const changeType = (type: string) => {
    setGradient((prev) => {
      if (prev) return { ...prev, type };
    });
    setParam("type", type);
    setParam("angle", null);
  };

  return (
    <main className="w-full h-fit p-7 grid grid-cols-[auto_1fr] gap-14 text-sm">
      <section className="w-fit">
        <ul className="p-7 grid grid-cols-[auto_auto] grid-rows-[auto_auto] gap-4 text-center border border-primary-border rounded-2xl">
          <li>
            <button
              className={`
                w-20 flex flex-col items-center justify-center gap-1 secondary-hover
                ${gradient?.type === "horizontal" ? "secondary-active" : ""}
              `}
              onClick={() => changeType("horizontal")}
            >
              <span className="icon-rectangle-h text-2xl" />
              Horizontal
            </button>
          </li>

          <li>
            <button
              className={`
                w-20 flex flex-col items-center justify-center gap-1 secondary-hover
                ${gradient?.type === "vertical" ? "secondary-active" : ""}
              `}
              onClick={() => changeType("vertical")}
            >
              <span className="icon-rectangle-v text-2xl" />
              Vertical
            </button>
          </li>

          <li>
            <button
              className={`
                w-20 flex flex-col items-center justify-center gap-1 secondary-hover
                ${gradient?.type === "conic" ? "secondary-active" : ""}
              `}
              onClick={() => changeType("conic")}
            >
              <span className="icon-cone text-2xl" />
              Conic
            </button>
          </li>

          <li>
            <button
              className={`
                w-20 flex flex-col items-center justify-center gap-1 secondary-hover
                ${gradient?.type === "circle" ? "secondary-active" : ""}
              `}
              onClick={() => changeType("circle")}
            >
              <span className="icon-circle text-2xl" />
              Circle
            </button>
          </li>
        </ul>

        {gradient?.angle !== null && gradient?.angle !== undefined && (
          <AngleInput angle={gradient?.angle} setGradient={setGradient} />
        )}
      </section>
      <div
        className="h-96 border border-primary-border rounded-2xl"
        style={{ background: gradientStyle }}
      ></div>
    </main>
  );
}
