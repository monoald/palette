import {
  Dispatch,
  PointerEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { getParam, setParam } from "@/app/utils/urlState";

type Props = {
  circlePosition: { x: number; y: number };
  updateCirclePosition: (position: { x: number; y: number }) => void;
  setCirclePositionOpen: Dispatch<SetStateAction<boolean>>;
};

export function CirclePosition({
  circlePosition,
  updateCirclePosition,
  setCirclePositionOpen,
}: Props) {
  const [isClicked, setIsClicked] = useState(false);
  const rectangleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsClicked(true);

    const element = e.target as HTMLElement;
    element.classList.add("angle-active");
    const elementRect = element.getBoundingClientRect();
    const rectangleRect = (
      rectangleRef.current as HTMLElement
    ).getBoundingClientRect();

    const x = Math.round(
      ((e.clientX - rectangleRect.x) / elementRect.width) * 200
    );
    const y = Math.round(
      ((e.clientY - rectangleRect.y) / elementRect.height) * 200
    );

    updateCirclePosition({ x, y });
    setParam("circle-x", x);
    setParam("circle-y", y);
    if (getParam("type")) {
      setParam("type", null);
    }
  };

  const handleMouseUp = (e: PointerEvent<HTMLDivElement>) => {
    const circle = e.target as HTMLElement;
    circle.classList.remove("angle-active");
    setIsClicked(false);
    setParam("circle-x", circlePosition.x);
    setParam("circle-y", circlePosition.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isClicked) {
      const element = e.target as HTMLElement;
      const elementRect = element.getBoundingClientRect();
      const rectangleRect = (
        rectangleRef.current as HTMLElement
      ).getBoundingClientRect();

      const x = Math.round(
        ((e.clientX - rectangleRect.x) / elementRect.width) * 200
      );
      const y = Math.round(
        ((e.clientY - rectangleRect.y) / elementRect.height) * 200
      );

      updateCirclePosition({ x, y });
    }
  };

  const handleAngleChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    toUpdate: string
  ) => {
    const target = e.target as HTMLInputElement;
    const newPosition = +target.value;

    if (toUpdate === "x") {
      updateCirclePosition({ x: newPosition, y: circlePosition.y });
      setParam("circle-x", newPosition);
    } else {
      updateCirclePosition({ x: circlePosition.x, y: newPosition });
      setParam("circle-y", newPosition);
    }
    if (getParam("type")) {
      setParam("type", null);
    }
  };

  return (
    <dialog className="absolute top-1/2 -translate-y-1/2 p-7 w-fit h-fit flex flex-col items-center gap-5 border border-primary-border rounded-2xl z-[1] text-secondary backdrop-blur-md bg-transparent-main transition-all">
      <button
        className="secondary-button w-8 h-8 ml-auto"
        onClick={() => setCirclePositionOpen(false)}
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
      <div className="flex flex-col gap-5 items-center justify-center">
        <div
          className="w-80 h-56 flex items-center justify-center border border-primary-border rounded-2xl"
          onPointerDown={handleMouseDown}
          onPointerUp={handleMouseUp}
          onPointerMove={handleMouseMove}
        >
          <div
            ref={rectangleRef}
            className="relative w-40 h-28 border border-primary-border rounded-2xl bg-transparent pointer-events-none"
          >
            <div
              className="absolute w-3 h-3 border border-primary-border rounded-full bg-transparent pointer-events-none"
              style={{
                left: `${circlePosition.x}%`,
                top: `${circlePosition.y}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <label htmlFor="angle">x</label>
            <input
              className="px-4 w-16 text-center"
              name="angle"
              type="number"
              value={circlePosition.x}
              onChange={(e) => handleAngleChanged(e, "x")}
              min={0}
              max={360}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <label htmlFor="angle">y</label>
            <input
              className="px-4 w-16 text-center"
              name="angle"
              type="number"
              value={circlePosition.y}
              onChange={(e) => handleAngleChanged(e, "y")}
              min={0}
              max={360}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
