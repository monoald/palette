"use client";

import { makeRandomID } from "@/app/utils/makeRandomID";
import { getParam, setParam } from "@/app/utils/urlState";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AngleInput } from "./components/AngleInput";
import SideBar from "./components/SideBar";
import OptionBar from "@/app/components/OptionBar";
import { CirclePosition } from "./components/CirclePosition";

export type Gradient = {
  type: string;
  angle: number;
  colors: { id: string; clr: string; stop: number }[];
  circlePosition: { x: number; y: number };
};

const gradientTypes = ["horizontal", "vertical", "circle", "conic"];

export default function Page({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const [gradient, setGradient] = useState<Gradient>({
    type: searchParams?.get("type") || "horizontal",
    angle:
      +(searchParams?.get("angle") as string) ||
      searchParams?.get("type") === "horizontal"
        ? 90
        : 0,
    colors: params.slug
      .split("-")
      .map((clr) => ({ id: makeRandomID(), clr: "#" + clr, stop: 0 })),
    circlePosition: {
      x: +(searchParams?.get("circle-x") as string) || 50,
      y: +(searchParams?.get("circle-y") as string) || 50,
    },
  });
  const [gradientStyle, setGradientStyle] = useState<string>();

  useEffect(() => {
    function createGradientFromState() {
      const colors = gradient.colors.map((clr) => clr.clr).join(", ");
      let typeGradient = `linear-gradient(${gradient.angle ?? 90}deg, `;
      const type = getParam("type");

      if (type === "circle" || getParam("circle-x")) {
        typeGradient = `radial-gradient(circle at ${gradient.circlePosition.x}% ${gradient.circlePosition.y}%, `;
      } else if (type === "conic") {
        typeGradient = "conic-gradient(";
      }

      return typeGradient + colors + ")";
    }
    setGradientStyle(createGradientFromState());
  }, [gradient]);

  // OPTIONS
  const [gradientTypeOpen, setGradientTypeOpen] = useState(false);

  const selectGradientType = (selected: string) => {
    setGradient((prev) => {
      let angle = prev.angle;

      if (selected === "horizontal") {
        angle = 90;
      } else if (selected === "vertical") {
        angle = 0;
      }

      return { ...prev, type: selected, angle };
    });
    setParam("type", selected);
    setParam("angle", null);
    setParam("circle-x", null);
    setParam("circle-y", null);
  };

  // MODALS
  const [angleOpen, setAngleOpen] = useState(false);
  const [circlePositionOpen, setCirclePositionOpen] = useState(false);

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row">
      <SideBar
        setGradientTypeOpen={setGradientTypeOpen}
        setAngleOpen={setAngleOpen}
        setCirclePositionOpen={setCirclePositionOpen}
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
      {circlePositionOpen && (
        <CirclePosition
          circlePosition={gradient.circlePosition}
          setGradient={setGradient}
          setCirclePositionOpen={setCirclePositionOpen}
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
