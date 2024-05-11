import { useEffect, useState } from "react";
import { WCAGRequierements, rateContrast, hexToRgb } from "colors-kit";

interface ContrastCalculatorProps {
  currentIndex: number;
  colors: Color[];
  close: () => void;
}

export const ContrastCalculator = ({
  currentIndex,
  colors,
  close,
}: ContrastCalculatorProps) => {
  const [secondary, setSecondary] = useState<number>(
    colors[currentIndex + 1] ? currentIndex + 1 : currentIndex - 1
  );
  const [contrast, setContrast] = useState<WCAGRequierements | null>(null);
  const [colorSelect, setColorSelect] = useState(false);

  useEffect(() => {
    const contrast = rateContrast([
      hexToRgb(colors[currentIndex].hex),
      hexToRgb(colors[secondary].hex),
    ]);

    setContrast(contrast);
  }, [colors, currentIndex, secondary]);

  const toggleColors = () => {
    setColorSelect(!colorSelect);
  };

  const selectSecondary = (id: string) => {
    const index = colors.findIndex((clr) => clr.id === id);
    setSecondary(index);
  };

  return (
    <dialog className="absolute top-1/2 -translate-y-1/2 w-fit h-fit p-7 flex flex-col gap-8 border border-secondary-border z-[1] text-secondary rounded-2xl backdrop-blur-md bg-transparent-main transition-all">
      <button
        className="secondary-button right-7 top-7 w-8 h-8"
        style={{ position: "absolute" }}
        onClick={close}
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

      <div className="flex items-baseline justify-center gap-5" data-tooltip>
        <p className="text-5xl font-semibold">Aa</p>
        <p className="text-3xl font-bold">{contrast?.contrastValue}</p>
      </div>

      <div className="flex gap-14 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">AA</p>
          <p className="flex items-center justify-between gap-3">
            Small Text
            <span
              className={`text-2xl ${
                contrast?.AA.smallText ? "icon-check-filled" : "icon-x-filled"
              }`}
            />
          </p>
          <p className="flex items-center justify-between gap-3">
            Large Text
            <span
              className={`text-2xl ${
                contrast?.AA.largeText ? "icon-check-filled" : "icon-x-filled"
              }`}
            />
          </p>
          <p className="flex items-center justify-between gap-3">
            UI Component
            <span
              className={`text-2xl ${
                contrast?.AA.uiComponent ? "icon-check-filled" : "icon-x-filled"
              }`}
            />
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">AAA</p>
          <p className="flex items-center justify-between gap-3">
            Small Text
            <span
              className={`text-2xl ${
                contrast?.AAA.smallText ? "icon-check-filled" : "icon-x-filled"
              }`}
            />
          </p>
          <p className="flex items-center justify-between gap-3">
            Large Text
            <span
              className={`text-2xl ${
                contrast?.AAA.largeText ? "icon-check-filled" : "icon-x-filled"
              }`}
            />
          </p>
          <p className="flex items-center justify-between gap-3">
            UI Component
            <span
              className={`text-2xl ${
                contrast?.AAA.uiComponent
                  ? "icon-check-filled"
                  : "icon-x-filled"
              }`}
            />
          </p>
        </div>
      </div>

      <div className="relative flex justify-center">
        <div
          className="w-full h-8 rounded-l-md p-1 text-center uppercase font-semibold"
          style={{
            backgroundColor: colors[currentIndex].hex,
            color: colors[currentIndex].contrastColor,
          }}
        >
          {colors[currentIndex].hex}
        </div>

        <button
          className="w-full h-8 rounded-r-md text-center uppercase font-semibold"
          onClick={toggleColors}
          style={{
            backgroundColor: colors[secondary].hex,
            color: colors[secondary].contrastColor,
          }}
        >
          {colors[secondary].hex}
        </button>

        <div
          className={`absolute bottom-full w-fit flex transition-all ${
            colorSelect ? "h-8" : "h-0"
          }`}
        >
          {colors.map((clr) => (
            <button
              className="w-12 first:rounded-tl-md last:rounded-tr-md"
              key={`${clr.id}-${clr.hex}`}
              style={{ background: clr.hex }}
              onClick={() => selectSecondary(clr.id)}
            ></button>
          ))}
        </div>
      </div>
    </dialog>
  );
};
