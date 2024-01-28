"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AngleInput } from "./components/AngleInput";
import SideBar from "./components/SideBar";
import OptionBar from "@/app/components/OptionBar";
import { CirclePosition } from "./components/CirclePosition";
import {
  handleCreateGradientOnFirstRender,
  handleCreateStyles,
  handleUpdateGradientAngle,
  handleUpdateGradientCirclePosition,
  handleUpdateGradientType,
} from "./handlers";

const gradientTypes = ["horizontal", "vertical", "circle", "conic"];

export default function Page({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const [gradient, setGradient] = useState(
    handleCreateGradientOnFirstRender(params.slug, searchParams)
  );
  const [gradientStyle, setGradientStyle] = useState(
    handleCreateStyles(searchParams, gradient)
  );

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
    const newType = handleUpdateGradientType(selected);
    setGradientStyle((prev) => ({ ...prev, type: newType }));
  };

  // ANGLE
  const updateAngle = (angle: number) => {
    setGradient((prev) => ({ ...prev, angle }));
    setGradientStyle((prev) => ({
      ...prev,
      type: handleUpdateGradientAngle(angle),
    }));
  };

  // CIRCLE POSITION
  const updateCirclePosition = (position: { x: number; y: number }) => {
    setGradient((prev) => ({ ...prev, circlePosition: position }));
    setGradientStyle((prev) => ({
      ...prev,
      type: handleUpdateGradientCirclePosition(position),
    }));
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
          updateAngle={updateAngle}
          setAngleOpen={setAngleOpen}
        />
      )}
      {circlePositionOpen && (
        <CirclePosition
          updateCirclePosition={updateCirclePosition}
          circlePosition={gradient.circlePosition}
          setCirclePositionOpen={setCirclePositionOpen}
        />
      )}
      <main className="w-full h-full text-sm">
        <div
          className="w-full h-full flex border border-primary-border rounded-2xl"
          style={{
            background: `${gradientStyle?.type}${gradientStyle?.colors}${gradientStyle?.end}`,
          }}
        ></div>
      </main>
    </div>
  );
}
