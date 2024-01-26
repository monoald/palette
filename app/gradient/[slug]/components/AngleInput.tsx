import { Dispatch, PointerEvent, SetStateAction, useState } from "react";
import { Gradient } from "../page";

import "./AngleInput.css";
import { getParam, setParam } from "@/app/utils/urlState";

type Props = {
  angle: number;
  setGradient: Dispatch<SetStateAction<Gradient | undefined>>;
};

export function AngleInput({ angle, setGradient }: Props) {
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsClicked(true);

    const circle = e.target as HTMLElement;
    circle.classList.add("angle-active");
    const rect = circle.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const deltaX = mouseX - centerX;
    const deltaY = centerY - mouseY;

    const radians = Math.atan2(deltaY, deltaX);
    let degrees = radians * (180 / Math.PI);

    if (degrees < 0) {
      degrees += 360;
    }

    degrees = Math.abs(degrees - 450);
    degrees = degrees > 360 ? Math.abs(degrees - 360) : degrees;

    setGradient((prev) => {
      if (prev) return { ...prev, angle: Math.round(degrees) };
    });
    setParam("angle", Math.floor(degrees));
    if (getParam("type")) {
      setParam("type", null);
    }
  };

  const handleMouseUp = (e: PointerEvent<HTMLDivElement>) => {
    const circle = e.target as HTMLElement;
    circle.classList.remove("angle-active");
    setIsClicked(false);
    setParam("angle", angle);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isClicked) {
      const circle = e.target as HTMLElement;
      const rect = circle.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const deltaX = mouseX - centerX;
      const deltaY = centerY - mouseY;

      const radians = Math.atan2(deltaY, deltaX);
      let degrees = radians * (180 / Math.PI);

      if (degrees < 0) {
        degrees += 360;
      }

      degrees = Math.abs(degrees - 450);
      degrees = degrees > 360 ? Math.abs(degrees - 360) : degrees;

      setGradient((prev) => {
        if (prev) return { ...prev, angle: Math.floor(degrees) };
      });
    }
  };

  const handleAngleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newAngle = +target.value;

    setGradient((prev) => {
      if (prev) return { ...prev, angle: newAngle };
    });
    setParam("angle", newAngle);
    if (getParam("type")) {
      setParam("type", null);
    }
  };

  return (
    <div className="p-7 w-fit flex flex-col items-center gap-5 border border-primary-border rounded-2xl">
      <div
        className="relative w-20 h-20 border border-primary-border rounded-full bg-transparent"
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
        onPointerMove={handleMouseMove}
      >
        <div
          className="absolute w-3 h-3 border border-primary-border rounded-full bg-transparent pointer-events-none"
          style={{
            left:
              "calc(50% + 24px * cos(" + Math.abs(angle - 450) + "deg) - 4px)",
            top:
              "calc(50% - 24px * sin(" + Math.abs(angle - 450) + "deg) - 4px)",
          }}
        ></div>
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor="angle">Angle</label>
        <input
          className="px-4 w-16 text-center"
          name="angle"
          type="number"
          value={angle}
          onChange={handleAngleChanged}
          min={0}
          max={360}
        />
      </div>
    </div>
  );
}
