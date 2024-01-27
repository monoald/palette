import { Hsv, colorFormatConverter } from "colors-kit";
import { BackgroundColor, RangeInput } from "../RangeInput";
import { dispatch } from "@/app/hooks/useStateHandler";
import { keepNumberInRange } from "@/app/utils/keepNumberInRange";

interface Props {
  clr: { id: string; hex: string; formats: Formats };
}

export function HsbPicker({ clr }: Props) {
  const hsv = clr.formats.hsv as Hsv;
  const hex = colorFormatConverter(hsv, {
    currentFormat: "hsv",
    targetFormat: ["hex"],
  }).hex as string;

  const saturationBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsv.h, s: 0, v: hsv.v },
      { currentFormat: "hsv", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsv.h, s: 100, v: hsv.v },
      { currentFormat: "hsv", targetFormat: ["hex"] }
    ).hex as string,
  };

  const brightnessBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsv.h, s: hsv.s, v: 0 },
      { currentFormat: "hsv", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsv.h, s: hsv.s, v: 100 },
      { currentFormat: "hsv", targetFormat: ["hex"] }
    ).hex as string,
  };

  function hsbChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const identifier = target.name || target.id;

    const value = +target.value;

    const hueValue =
      identifier === "hue" ? keepNumberInRange(0, 360, value) : hsv.h;
    const saturationValue =
      identifier === "saturation" ? keepNumberInRange(0, 100, value) : hsv.s;
    const brightnessValue =
      identifier === "brightness" ? keepNumberInRange(0, 100, value) : hsv.v;

    dispatch("custom:updatePaletteFromPicker", {
      id: clr.id,
      clr: { h: hueValue, s: saturationValue, v: brightnessValue },
      format: "hsv",
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
            value={hsv.h}
            onChange={hsbChange}
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
            value={hsv.s}
            onChange={hsbChange}
          />
        </label>

        <label className="value">
          <p>b</p>
          <input
            className="w-10 text-center"
            name="brightness"
            type="number"
            min={0}
            max={100}
            value={hsv.v}
            onChange={hsbChange}
          />
        </label>
      </div>

      <div className="sliders-container">
        <RangeInput
          id="hue"
          min={0}
          max={360}
          value={hsv.h as number}
          onChange={hsbChange}
          isHue
        />
        <RangeInput
          id="saturation"
          min={0}
          max={100}
          value={hsv.s}
          onChange={hsbChange}
          thumbColor={hex}
          backgroundColor={`${saturationBackground.start}, ${saturationBackground.end}`}
        />
        <RangeInput
          id="brightness"
          min={0}
          max={100}
          value={hsv.v}
          onChange={hsbChange}
          thumbColor={hex}
          backgroundColor={`${brightnessBackground.start}, ${brightnessBackground.end}`}
        />
      </div>
    </>
  );
}
