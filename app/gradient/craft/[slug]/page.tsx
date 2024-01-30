"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AngleInput } from "./components/AngleInput";
import SideBar from "./components/SideBar";
import OptionBar from "@/app/components/OptionBar";
import { CirclePosition } from "./components/CirclePosition";
import {
  handleCreateGradientOnFirstRender,
  handleCreateStyles,
  handleUpdateAngle,
  handleUpdateCirclePosition,
  handleUpdateColorStyle,
  handleUpdateStop,
  handleUpdateType,
} from "./handlers";
import { CustomRange } from "./components/CustomRange";

const gradientTypes = ["horizontal", "vertical", "circle", "conic"];

export default function Page({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const [gradient, setGradient] = useState<Gradient>();
  const [gradientStyle, setGradientStyle] = useState<{
    type: string;
    colors: string;
    end: string;
  }>();

  useEffect(() => {
    const newGradient = handleCreateGradientOnFirstRender(
      params.slug,
      searchParams as ReadonlyURLSearchParams
    );

    setGradient(newGradient);
    setGradientStyle(
      handleCreateStyles(searchParams as ReadonlyURLSearchParams, newGradient)
    );
  }, [params.slug, searchParams]);

  // OPTIONS
  const [gradientTypeOpen, setGradientTypeOpen] = useState(false);

  const selectGradientType = (selected: string) => {
    setGradient((prev) => {
      if (prev) {
        let angle = prev.angle;

        if (selected === "horizontal") {
          angle = 90;
        } else if (selected === "vertical") {
          angle = 0;
        }

        return { ...prev, type: selected, angle };
      }
    });
    const newType = handleUpdateType(selected);
    setGradientStyle((prev) => {
      if (prev) return { ...prev, type: newType };
    });
  };

  // ANGLE
  const updateAngle = (angle: number) => {
    setGradient((prev) => {
      if (prev) return { ...prev, angle };
    });
    setGradientStyle((prev) => {
      if (prev)
        return {
          ...prev,
          type: handleUpdateAngle(angle),
        };
    });
  };

  // CIRCLE POSITION
  const updateCirclePosition = (position: { x: number; y: number }) => {
    setGradient((prev) => {
      if (prev) return { ...prev, circlePosition: position };
    });
    setGradientStyle((prev) => {
      if (prev)
        return {
          ...prev,
          type: handleUpdateCirclePosition(position),
        };
    });
  };

  // MODALS
  const [angleOpen, setAngleOpen] = useState(false);
  const [circlePositionOpen, setCirclePositionOpen] = useState(false);

  // STOPS
  const updateStop = (id: string, stop: number) => {
    const newClrs = handleUpdateStop(
      gradient?.clrs as GradientColor[],
      id,
      stop
    );
    setGradient((prev) => {
      if (prev) return { ...prev, clrs: newClrs };
    });
    setGradientStyle((prev) => {
      if (prev) return { ...prev, colors: handleUpdateColorStyle(newClrs) };
    });
  };

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row">
      {gradient && gradientStyle && (
        <>
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
          <main className="w-full h-full flex flex-col gap-8 text-sm">
            <div className="w-full h-full flex border border-primary-border rounded-2xl overflow-hidden">
              <div
                className="relative w-full h-full"
                style={{
                  background: `${gradientStyle?.type}${gradientStyle?.colors}${gradientStyle?.end}`,
                }}
              ></div>
            </div>
            <CustomRange
              styleClrs={gradientStyle.colors}
              clrs={gradient.clrs}
              updateStop={updateStop}
            />
          </main>
        </>
      )}
    </div>
  );
}
