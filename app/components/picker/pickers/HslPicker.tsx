import { Hsl, colorFormatConverter, hslToHex } from "colors-kit";
import { BackgroundColor, RangeInput } from "../RangeInput";
import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import { keepNumberInRange } from "@/app/utils/keepNumberInRange";

interface Props {
  clr: { id: string; hex: string; formats?: Formats };
}

export function HslPicker({ clr }: Props) {
  const hsl = clr.formats?.hsl as Hsl;
  const hex = hslToHex(hsl);

  const saturationBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsl.h, s: 0, l: hsl.l },
      { currentFormat: "hsl", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsl.h, s: 100, l: hsl.l },
      { currentFormat: "hsl", targetFormat: ["hex"] }
    ).hex as string,
  };

  const lightnessBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsl.h, s: hsl.s, l: 0 },
      { currentFormat: "hsl", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsl.h, s: hsl.s, l: 50 },
      { currentFormat: "hsl", targetFormat: ["hex"] }
    ).hex as string,
  };

  function hslChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const identifier = target.name || target.id;
    const value = +target.value;

    const hueValue =
      identifier === "hue" ? keepNumberInRange(0, 360, value) : hsl.h;
    const saturationValue =
      identifier === "saturation" ? keepNumberInRange(0, 100, value) : hsl.s;
    const lightnessValue =
      identifier === "lightness" ? keepNumberInRange(0, 100, value) : hsl.l;

    dispatch("custom:updatePaletteFromPicker", {
      id: clr.id,
      clr: { h: hueValue, s: saturationValue, l: lightnessValue },
      format: "hsl",
    });

    if (target.type === "number") {
      dispatch("custom:updateHistoryFromPicker");
    }
  }

  return (
    <>
      <div className="flex justify-evenly text-center">
        <label className="value">
          <p>h</p>
          <input
            className="w-10 text-center"
            name="hue"
            type="number"
            min={0}
            max={100}
            value={hsl.h}
            onChange={hslChange}
          />
        </label>

        <label className="value">
          <p>s</p>
          <input
            className="w-10 text-center"
            name="saturation"
            type="number"
            min={0}
            max={100}
            value={hsl.s}
            onChange={hslChange}
          />
        </label>

        <label className="value">
          <p>l</p>
          <input
            className="w-10 text-center"
            name="lightness"
            type="number"
            min={0}
            max={100}
            value={hsl.l}
            onChange={hslChange}
          />
        </label>
      </div>

      <div className="sliders-container">
        <RangeInput
          id="hue"
          min={0}
          max={360}
          value={hsl.h as number}
          onChange={hslChange}
          isHue
        />
        <RangeInput
          id="saturation"
          min={0}
          max={100}
          value={hsl.s}
          onChange={hslChange}
          thumbColor={hex}
          backgroundColor={`${saturationBackground.start}, ${saturationBackground.end}`}
        />
        <RangeInput
          id="lightness"
          min={0}
          max={100}
          value={hsl.l}
          onChange={hslChange}
          thumbColor={hex}
          backgroundColor={`${lightnessBackground.start}, ${lightnessBackground.end}, #fff`}
        />
      </div>
    </>
  );
}
