import { Rgb, colorFormatConverter } from "colors-kit";

import { BackgroundColor, RangeInput } from "../RangeInput";
import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import { keepNumberInRange } from "@/app/utils/keepNumberInRange";

interface Props {
  clr: { id: string; hex: string; formats?: Formats };
}

export function RgbPicker({ clr }: Props) {
  const rgb = clr.formats?.rgb as Rgb;
  const hex = colorFormatConverter(rgb, {
    currentFormat: "rgb",
    targetFormat: ["hex"],
  }).hex as string;

  const redBackground: BackgroundColor = {
    start: colorFormatConverter(
      { r: 0, g: rgb.g, b: rgb.b },
      { currentFormat: "rgb", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { r: 255, g: rgb.g, b: rgb.b },
      { currentFormat: "rgb", targetFormat: ["hex"] }
    ).hex as string,
  };

  const greenBackground: BackgroundColor = {
    start: colorFormatConverter(
      { r: rgb.r, g: 0, b: rgb.b },
      { currentFormat: "rgb", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { r: rgb.r, g: 255, b: rgb.b },
      { currentFormat: "rgb", targetFormat: ["hex"] }
    ).hex as string,
  };

  const blueBackground: BackgroundColor = {
    start: colorFormatConverter(
      { r: rgb.r, g: rgb.g, b: 0 },
      { currentFormat: "rgb", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { r: rgb.r, g: rgb.g, b: 255 },
      { currentFormat: "rgb", targetFormat: ["hex"] }
    ).hex as string,
  };

  function rgbChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const identifier = target.name || target.id;
    const value = +target.value;

    const redValue =
      identifier === "red" ? keepNumberInRange(0, 255, value) : rgb.r;
    const greenValue =
      identifier === "green" ? keepNumberInRange(0, 255, value) : rgb.g;
    const blueValue =
      identifier === "blue" ? keepNumberInRange(0, 255, value) : rgb.b;

    dispatch("custom:updatePaletteFromPicker", {
      id: clr.id,
      clr: { r: redValue, g: greenValue, b: blueValue },
      format: "rgb",
    });

    if (target.type === "number") {
      dispatch("custom:updateHistoryFromPicker");
    }
  }

  return (
    <>
      <div className="flex justify-evenly text-center">
        <label className="value">
          <p>r</p>
          <input
            className="w-10 text-center"
            name="red"
            type="number"
            min={0}
            max={255}
            value={rgb.r}
            onChange={rgbChange}
          />
        </label>

        <label className="value">
          <p>g</p>
          <input
            className="w-10 text-center"
            name="green"
            type="number"
            min={0}
            max={255}
            value={rgb.g}
            onChange={rgbChange}
          />
        </label>

        <label className="value">
          <p>b</p>
          <input
            className="w-10 text-center"
            name="blue"
            type="number"
            min={0}
            max={255}
            value={rgb.b}
            onChange={rgbChange}
          />
        </label>
      </div>

      <div className="sliders-container">
        <RangeInput
          id="red"
          min={0}
          max={255}
          value={rgb.r}
          onChange={rgbChange}
          thumbColor={hex}
          backgroundColor={`${redBackground.start}, ${redBackground.end}`}
        />
        <RangeInput
          id="green"
          min={0}
          max={255}
          value={rgb.g}
          onChange={rgbChange}
          thumbColor={hex}
          backgroundColor={`${greenBackground.start}, ${greenBackground.end}`}
        />
        <RangeInput
          id="blue"
          min={0}
          max={255}
          value={rgb.b}
          onChange={rgbChange}
          thumbColor={hex}
          backgroundColor={`${blueBackground.start}, ${blueBackground.end}`}
        />
      </div>
    </>
  );
}
