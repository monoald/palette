import { Dispatch, PointerEvent, SetStateAction, useState } from "react";

import "./AngleInput.css";
import { dispatch } from "@/app/hooks/useStateHandler";

type Props = {
  angle: number;
  updateAngle: (angle: number) => void;
  setAngleOpen: Dispatch<SetStateAction<boolean>>;
};

export function AngleInput({ angle, updateAngle, setAngleOpen }: Props) {
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

    updateAngle(Math.round(degrees));
  };

  const handleMouseUp = (e: PointerEvent<HTMLDivElement>) => {
    const circle = e.target as HTMLElement;
    circle.classList.remove("angle-active");
    setIsClicked(false);
    dispatch("custom:updateHistoryFromProperty");
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

      updateAngle(Math.floor(degrees));
    }
  };

  const handleAngleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newAngle = +target.value;

    updateAngle(newAngle);
    dispatch("custom:updateHistoryFromProperty");
  };

  return (
    <dialog className="absolute top-1/2 -translate-y-1/2 p-7 w-fit h-fit flex flex-col items-center gap-5 border border-primary-border rounded-2xl z-[1] text-secondary backdrop-blur-md bg-transparent-main transition-all">
      <button
        className="secondary-button w-8 h-8 ml-auto"
        onClick={() => setAngleOpen(false)}
      >
        <div>
          <span className="icon-x" />
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
      </button>
      <div className="flex gap-5 items-center justify-center">
        <div
          className="relative w-28 h-28 border border-primary-border rounded-full bg-transparent"
          onPointerDown={handleMouseDown}
          onPointerUp={handleMouseUp}
          onPointerMove={handleMouseMove}
        >
          <div
            className="absolute w-3 h-3 border border-primary-border rounded-full bg-transparent pointer-events-none"
            style={{
              left:
                "calc(50% + 32px * cos(" +
                Math.abs(angle - 450) +
                "deg) - 4px)",
              top:
                "calc(50% - 32px * sin(" +
                Math.abs(angle - 450) +
                "deg) - 4px)",
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center gap-4">
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
    </dialog>
  );
}
