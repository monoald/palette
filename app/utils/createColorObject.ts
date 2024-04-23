import {
  Color as ColorsType,
  colorFormatConverter,
  toColorBlind,
} from "colors-kit";
import { getMainContrastColor } from "./createBaseColorObject";
import { makeRandomID } from "./makeRandomID";

export function createColorObject(
  color: ColorsType,
  format: string,
  attrs?: Partial<Color>
): Color {
  const { cmyk, hex, hsl, hsv, lab, rgb, xyz } = colorFormatConverter(color, {
    allFormats: true,
    currentFormat: format,
  }) as Formats;

  return {
    hex: hex || "",
    isLocked: attrs?.isLocked || false,
    isSaved: attrs?.isSaved || false,
    contrastColor: getMainContrastColor(rgb),
    id: attrs?.id || makeRandomID(),
    formats: {
      cmyk,
      hsv,
      hsl,
      lab,
      rgb,
      xyz,
    },
  };
}
