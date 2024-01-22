import {
  Color as ColorsType,
  Rgb,
  colorFormatConverter,
  rateContrast,
  toColorBlind,
} from "colors-kit";
import { makeRandomID } from "./makeRandomID";

function getMainContrastColor(color: Rgb): string {
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
    colorBlind: {
      achromatomaly: toColorBlind(hex as string, "achromatomaly") as string,
      achromatopsia: toColorBlind(hex as string, "achromatopsia") as string,
      deuteranomaly: toColorBlind(hex as string, "deuteranomaly") as string,
      deuteranopia: toColorBlind(hex as string, "deuteranopia") as string,
      protanomaly: toColorBlind(hex as string, "protanomaly") as string,
      protanopia: toColorBlind(hex as string, "protanopia") as string,
      tritanomaly: toColorBlind(hex as string, "tritanomaly") as string,
      tritanopia: toColorBlind(hex as string, "tritanopia") as string,
    },
  };
}
