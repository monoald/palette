import { Color as ColorsType, Rgb, hexToRgb, rateContrast } from "colors-kit";
import { makeRandomID } from "./makeRandomID";

export function getMainContrastColor(color: Rgb): string {
  const whiteContrast = rateContrast([
    { r: 255, g: 255, b: 255 },
    color,
  ]).contrastValue;
  const blackContrast = rateContrast([
    { r: 0, g: 0, b: 0 },
    color,
  ]).contrastValue;

  const mainContrastColor =
    whiteContrast > blackContrast ? "#ffffff" : "#000000";

  return mainContrastColor;
}

export function createBaseColorObject(
  color: ColorsType,
  attrs?: Partial<Color>
): Color {
  return {
    hex: color as string,
    isLocked: attrs?.isLocked || false,
    isSaved: attrs?.isSaved || false,
    contrastColor: getMainContrastColor(hexToRgb(color as string)),
    id: attrs?.id || makeRandomID(),
  };
}
