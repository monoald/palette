import { Rgb, rgbToHsv } from "colors-kit";
import {
  drawColorCanvas,
  findColorCoordinates,
} from "../../utils/pickerHandlers";
import { useEffect, useRef, useState } from "react";
import { dispatch } from "@/app/hooks/useStateHandler";

type Props = {
  clr: { id: string; hex: string; formats: Formats };
};

type Coordinates = {
  x: number;
  y: number;
  mouseMoved: boolean;
};

export function Canvas({ clr }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const circleRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update PickerColor when mouse moved
  useEffect(() => {
    if (coordinates !== null && coordinates.mouseMoved) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const imageData = ctx.getImageData(
        coordinates.x + 12,
        coordinates.y + 12,
        1,
        1
      ).data;
      const hsbColor = rgbToHsv({
        r: imageData[0],
        g: imageData[1],
        b: imageData[2],
      });

      dispatch("custom:updatePaletteFromPicker", {
        id: clr.id,
        clr: { h: clr.formats.hsv?.h as number, s: hsbColor.s, v: hsbColor.v },
        format: "hsv",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  const startDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    moveCircleToCurrentLocation(event);
    setIsDragging(true);
  };

  const moveDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      moveCircleToCurrentLocation(event);
    }
  };

  const endDrag = () => {
    setIsDragging(false);
    dispatch("custom:updateHistoryFromPicker");
  };

  const keyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLElement;
    const parent = target.parentElement as HTMLElement;
    const step = 1;
    const containerRect = parent.getBoundingClientRect();

    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();

      const newCoordinates = { ...coordinates } as Coordinates;
      switch (event.key) {
        case "ArrowUp":
          newCoordinates.y -= step;
          break;
        case "ArrowDown":
          newCoordinates.y += step;
          break;
        case "ArrowLeft":
          newCoordinates.x -= step;
          break;
        case "ArrowRight":
          newCoordinates.x += step;
          break;
        default:
          break;
      }

      newCoordinates.x = Math.max(
        -target.clientWidth / 2,
        Math.min(newCoordinates.x, containerRect.width - target.clientWidth / 2)
      );
      newCoordinates.y = Math.max(
        -target.clientHeight / 2,
        Math.min(
          newCoordinates.y,
          containerRect.height - target.clientHeight / 2
        )
      );

      setCoordinates(newCoordinates);
    }
  };

  function moveCircleToCurrentLocation(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const target = circleRef.current as HTMLElement;
    const parent = target.parentElement as HTMLElement;
    const containerRect = parent.getBoundingClientRect();

    const newX = event.clientX - containerRect.left - target.clientWidth / 2;
    const newY = event.clientY - containerRect.top - target.clientHeight / 2;

    const x = Math.max(
      -target.clientWidth / 2,
      Math.min(newX, containerRect.width - target.clientWidth / 2)
    );
    const y = Math.max(
      -target.clientHeight / 2,
      Math.min(newY, containerRect.height - target.clientHeight / 2)
    );

    setCoordinates({ x, y, mouseMoved: true });
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    drawColorCanvas(canvas, clr.formats.hsv?.h as number);

    const { x, y } = findColorCoordinates(canvas, clr.formats.rgb as Rgb);

    setCoordinates({ x: x - 12, y: y - 12, mouseMoved: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clr]);

  return (
    <div
      className="relative w-[220px] h-[220px]"
      onMouseDown={startDrag}
      onMouseMove={moveDrag}
      onMouseUp={endDrag}
    >
      <canvas
        className="border border-secondary-border rounded-xl overflow-hidden"
        width={220}
        height={220}
        ref={canvasRef}
      />

      {coordinates && (
        <button
          className="absolute w-6 h-6 p-0 flex items-center justify-center border border-primary-border rounded-full cursor-grab active:cursor-grabbing bg-main"
          style={{
            left: `${coordinates.x}px`,
            top: `${coordinates.y}px`,
          }}
          onKeyDown={keyDown}
          ref={circleRef}
        >
          <div
            className="w-[14px] h-[14px] border border-primary-border rounded-full pointer-events-none"
            style={{
              background: clr.hex,
            }}
          ></div>
        </button>
      )}
    </div>
  );
}
