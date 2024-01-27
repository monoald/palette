"use client";

import { makeRandomID } from "@/app/utils/makeRandomID";
import { setParam } from "@/app/utils/urlState";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AngleInput } from "./components/AngleInput";
import SideBar from "./components/SideBar";
import OptionBar from "@/app/components/OptionBar";

export type Gradient = {
  type: string;
  angle: number;
  colors: { id: string; clr: string; stop: number }[];
};

const gradientTypes = ["horizontal", "vertical", "circle", "conic"];

export default function Page({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const [gradient, setGradient] = useState<Gradient>({
    type: searchParams?.get("type") || "horizontal",
    angle: +(searchParams?.get("type") as string) || 90,
    colors: params.slug
      .split("-")
      .map((clr) => ({ id: makeRandomID(), clr: "#" + clr, stop: 0 })),
  });
  const [gradientStyle, setGradientStyle] = useState<string>();

  useEffect(() => {
    function createGradientFromState() {
      const colors = gradient.colors.map((clr) => clr.clr).join(", ");
      let typeGradient = `linear-gradient(${gradient.angle ?? 90}deg, `;

      if (gradient.type === "vertical") {
        typeGradient = "linear-gradient(0deg, ";
      } else if (gradient.type === "circle") {
        typeGradient = "radial-gradient(circle, ";
      } else if (gradient.type === "conic") {
        typeGradient = "conic-gradient(";
      }

      return typeGradient + colors + ")";
    }
    setGradientStyle(createGradientFromState());
  }, [gradient]);

  // OPTIONS
  const [gradientTypeOpen, setGradientTypeOpen] = useState(false);
  const selectGradientType = (selected: string) => {
    setGradient((prev) => ({ ...prev, type: selected }));
    setParam("type", selected);
    setParam("angle", null);
  };

  const [angleOpen, setAngleOpen] = useState(false);

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row">
      <SideBar
        setGradientTypeOpen={setGradientTypeOpen}
        setAngleOpen={setAngleOpen}
      />
      <OptionBar
        open={gradientTypeOpen}
        setOpen={setGradientTypeOpen}
        options={gradientTypes}
        current={gradient.type as string}
        selectOption={selectGradientType}
      />
      {angleOpen && (
        <AngleInput
          angle={gradient.angle}
          setGradient={setGradient}
          setAngleOpen={setAngleOpen}
        />
      )}
      <main className="w-full h-full text-sm">
        <div
          className="w-full h-full flex border border-primary-border rounded-2xl"
          style={{ background: gradientStyle }}
        ></div>
      </main>
    </div>
  );
}
