"use client";
import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import { replacePath, setParam } from "@/app/utils/urlState";
import { PointerEvent, useRef, useState } from "react";

type Props = {
  styleClrs: string;
  clrs: GradientColor[];
  updateStop: (id: string, stop: number) => void;
};

export function CustomRange({ styleClrs, clrs, updateStop }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentClr, setCurrentClr] = useState<string>();

  const handleDragStart = (e: PointerEvent<HTMLButtonElement>, id: string) => {
    setCurrentClr(id);
  };

  const handleDragMove = (e: PointerEvent<HTMLDivElement>) => {
    if (currentClr) {
      const range = sliderRef.current as HTMLElement;
      const rect = range.getBoundingClientRect();
      let stop = Math.round(((e.clientX - rect.x) / rect.width) * 100);

      if (stop > 100) {
        stop = 100;
      } else if (stop < 0) {
        stop = 0;
      }
      updateStop(currentClr, stop);
    }
  };

  const handleDragEnd = () => {
    setCurrentClr(undefined);

    const newUrl = clrs
      .map((clr) => clr.hex.replace("#", ""))
      .join("-") as string;
    replacePath(newUrl);
    const stops = clrs.map((clr) => clr.stop).join("-");
    setParam("stops", stops);
    dispatch("custom:updateHistoryFromPicker", { updatePath: false });
  };

  return (
    <div
      className="relative w-full h-5 border border-secondary-border rounded-full flex items-center"
      ref={sliderRef}
      style={{ background: `linear-gradient(${90}deg, ` + styleClrs + ")" }}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      {clrs.map((clr) => (
        <button
          key={clr.id}
          id={clr.id}
          className="absolute w-8 h-8 p-0 flex items-center justify-center border border-primary-border rounded-full cursor-grab active:cursor-grabbing bg-main"
          style={{
            left: `calc(${clr.stop}% - 10px)`,
          }}
          onPointerDown={(e: PointerEvent<HTMLButtonElement>) =>
            handleDragStart(e, clr.id)
          }
        >
          <div
            className="w-4 h-4 border border-primary-border rounded-full pointer-events-none"
            style={{ background: clr.hex }}
          ></div>
        </button>
      ))}
    </div>
  );
}
