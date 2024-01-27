import { Cmyk, colorFormatConverter } from "colors-kit";
import { BackgroundColor, RangeInput } from "../RangeInput";
import { dispatch } from "@/app/hooks/useStateHandler";
import { keepNumberInRange } from "@/app/utils/keepNumberInRange";

type Props = {
  clr: { id: string; hex: string; formats: Formats };
};

export function CmykPicker({ clr }: Props) {
  const cmyk = clr.formats.cmyk as Cmyk;

  const hex = colorFormatConverter(cmyk, {
    currentFormat: "cmyk",
    targetFormat: ["hex"],
  }).hex as string;

  const cyanBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: 0, m: cmyk.m, y: cmyk.y, k: cmyk.k },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { c: 100, m: cmyk.m, y: cmyk.y, k: cmyk.k },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
  };

  const magentaBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: cmyk.c, m: 0, y: cmyk.y, k: cmyk.k },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { c: cmyk.c, m: 100, y: cmyk.y, k: cmyk.k },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
  };

  const yellowBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: 0, k: cmyk.k },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: 100, k: cmyk.k },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
  };

  const keyBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: cmyk.y, k: 0 },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
    end: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: cmyk.y, k: 100 },
      { currentFormat: "cmyk", targetFormat: ["hex"] }
    ).hex as string,
  };

  function cmykChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const identifier = target.name || target.id;
    const value = keepNumberInRange(0, 100, +target.value);

    const cyanValue = identifier === "cyan" ? value : cmyk.c;

    const magentaValue = identifier === "magenta" ? value : cmyk.m;

    const yellowValue = identifier === "yellow" ? value : cmyk.y;

    const keyValue = identifier === "key" ? value : cmyk.k;

    dispatch("custom:updatePaletteFromPicker", {
      id: clr.id,
      clr: { c: cyanValue, m: magentaValue, y: yellowValue, k: keyValue },
      format: "cmyk",
    });

    if (target.type === "number") {
      dispatch("custom:updateHistoryFromPicker");
    }
  }

  return (
    <>
      <div className="flex justify-evenly text-center">
        <label className="value">
          <p>c</p>
          <input
            className="w-10 text-center"
            name="cyan"
            type="number"
            min={0}
            max={100}
            value={cmyk.c}
            onChange={cmykChange}
          />
        </label>

        <label className="value">
          <p>m</p>
          <input
            className="w-10 text-center"
            name="magenta"
            type="number"
            min={0}
            max={100}
            value={cmyk.m}
            onChange={cmykChange}
          />
        </label>

        <label className="value">
          <p>y</p>
          <input
            className="w-10 text-center"
            name="yellow"
            type="number"
            min={0}
            max={100}
            value={cmyk.y}
            onChange={cmykChange}
          />
        </label>

        <label className="value">
          <p>k</p>
          <input
            className="w-10 text-center"
            name="key"
            type="number"
            min={0}
            max={100}
            value={cmyk.k}
            onChange={cmykChange}
          />
        </label>
      </div>

      <div className="sliders-container">
        <RangeInput
          id="cyan"
          min={0}
          max={100}
          value={cmyk.c}
          onChange={cmykChange}
          thumbColor={hex}
          backgroundColor={`${cyanBackground.start}, ${cyanBackground.end}`}
        />
        <RangeInput
          id="magenta"
          min={0}
          max={100}
          value={cmyk.m}
          onChange={cmykChange}
          thumbColor={hex}
          backgroundColor={`${magentaBackground.start}, ${magentaBackground.end}`}
        />
        <RangeInput
          id="yellow"
          min={0}
          max={100}
          value={cmyk.y}
          onChange={cmykChange}
          thumbColor={hex}
          backgroundColor={`${yellowBackground.start}, ${yellowBackground.end}`}
        />
        <RangeInput
          id="key"
          min={0}
          max={100}
          value={cmyk.k}
          onChange={cmykChange}
          thumbColor={hex}
          backgroundColor={`${keyBackground.start}, ${keyBackground.end}`}
        />
      </div>
    </>
  );
}
