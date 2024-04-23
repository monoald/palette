/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { extractPalette, hexToRgb, rgbToHex } from "colors-kit";
import { getMainContrastColor } from "@/app/utils/createBaseColorObject";
import { keepNumberInRange } from "@/app/utils/keepNumberInRange";
import { dispatch } from "@/app/(core)/hooks/useStateHandler";

type Props = {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
};

export function ImageCanvas({ url, setUrl }: Props) {
  const [extract, setExtract] = useState(true);
  const [quantity, setQuantity] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [pickerColor, setPickerColor] = useState("");
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [pickerActive, setPickerActive] = useState(false);
  const imageRef = useRef<HTMLCanvasElement>(null);
  const circleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function extractColors() {
      try {
        const rgbColors = await extractPalette(url, quantity);
        const hexColors = rgbColors.map((color) => rgbToHex(color));
        setExtractedColors(hexColors);
      } catch (error) {
        setUrl("");
      }
    }

    if (imageRef.current !== null) {
      const canvas = imageRef.current as HTMLCanvasElement;
      const context = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      const img = new Image();
      img.src = url;
      img.onload = () => {
        const ratio = 340 / img.height;
        const newWidth = img.width * ratio;

        canvas.width = newWidth;
        canvas.height = 340;
        context?.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      extractColors();
    }
  }, [url, extract]);

  useEffect(() => {
    if (url !== "") {
      const canvas = imageRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;
      const imageData = ctx.getImageData(
        coordinates.x + 15,
        coordinates.y + 15,
        1,
        1
      ).data;

      const colorHex = rgbToHex({
        r: imageData[0],
        g: imageData[1],
        b: imageData[2],
      });

      setPickerColor(colorHex);

      setExtractedColors((colors) => {
        colors[colors.length - 1] = colorHex;
        return colors;
      });
    }
  }, [coordinates]);

  useEffect(() => {
    if (pickerActive) {
      handlePickColor();
    }
  }, [pickerActive]);

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = keepNumberInRange(0, 10, +event.target.value);
    setQuantity(value);
  }

  function handleQuantitySubmit(
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setExtract(!extract);
  }

  const handleStartDrag = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (pickerActive) {
      moveCircleToCurrentLocation(event);
      setIsDragging(true);
    }
  };

  const handleMoveDrag = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isDragging) {
      moveCircleToCurrentLocation(event);
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  function moveCircleToCurrentLocation(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const target = circleRef.current as HTMLElement;
    const parent = target.parentElement as HTMLElement;
    const containerRect = parent.getBoundingClientRect();

    const newX = event.clientX - containerRect.left - target.clientWidth / 2;
    const newY = event.clientY - containerRect.top - target.clientHeight / 2;

    const x = Math.round(
      Math.max(
        -target.clientWidth / 2,
        Math.min(newX, containerRect.width - target.clientWidth / 2)
      )
    );
    const y = Math.round(
      Math.max(
        -target.clientHeight / 2,
        Math.min(newY, containerRect.height - target.clientHeight / 2)
      )
    );

    setCoordinates({ x, y });
  }

  function handlePickColor() {
    const newColors = Array.from(extractedColors);
    newColors.push("#000000");
    setExtractedColors(newColors);
  }

  function handleAddColorsToPalette() {
    const newUrl = extractedColors.join("-").replaceAll("#", "");

    dispatch("custom:updatePaletteFromImg", { url: newUrl });
  }

  return (
    <>
      {extractedColors.length === 0 && <p className="loading">LOADING...</p>}

      <div
        className={`flex-col gap-4 ${
          extractedColors.length === 0 ? "hidden" : "flex"
        }`}
      >
        <div
          className="relative w-fit h-fit"
          onMouseDown={handleStartDrag}
          onMouseMove={handleMoveDrag}
          onMouseUp={handleEndDrag}
        >
          <canvas
            ref={imageRef}
            id="canvas"
            onDragStart={(event) => {
              event.preventDefault();
            }}
          />
          {pickerActive && (
            <button
              className="absolute w-7 h-7 rounded-full bg-[url('/picker-thumb.svg')] p-0 border-none"
              ref={circleRef}
              id="canvas-thumb"
              style={{
                left: `${coordinates.x}px`,
                top: `${coordinates.y}px`,
                backgroundColor: pickerColor,
              }}
            ></button>
          )}
        </div>

        <div className="w-full h-fit flex">
          {extractedColors.length !== 0 &&
            extractedColors.map((color) => (
              <button
                className="group w-full h-6 first:rounded-l-md last:rounded-r-md text-sm"
                key={color}
                style={{
                  background: color,
                }}
              >
                <p
                  className="hidden uppercase group-hover:block"
                  style={{
                    color: getMainContrastColor(hexToRgb(color)),
                  }}
                >
                  {color}
                </p>
              </button>
            ))}
        </div>

        <div className="flex justify-between gap-5">
          <button
            className="p-2 flex text-2xl secondary-hover"
            onClick={() => setPickerActive(!pickerActive)}
            tooltip="true"
            tooltip-content="Color picker"
            tooltip-position="bottom"
          >
            <span className="icon-eye-dropper" />
          </button>

          <button
            className="p-2 flex text-2xl secondary-hover"
            onClick={handleAddColorsToPalette}
            tooltip="true"
            tooltip-content="Add palette"
            tooltip-position="bottom"
          >
            <span className="icon-palette" />
          </button>

          <button
            className="p-2 flex text-2xl secondary-hover"
            onClick={handleQuantitySubmit}
            tooltip="true"
            tooltip-content="Extract colors again"
            tooltip-position="bottom"
          >
            <span className="icon-reset" />
          </button>

          <form className="ml-auto" onSubmit={handleQuantitySubmit}>
            <label htmlFor="quantity">Quantity:</label>

            <input
              className="max-w-10 text-center ml-4"
              min={0}
              max={10}
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </form>
        </div>
      </div>
    </>
  );
}
