import {
  Color as ColorsType,
  Rgb,
  colorFormatConverter,
  rateContrast,
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

export function createColorObject(color: ColorsType, format: string): Color {
  const { cmyk, hex, hsl, hsv, lab, rgb, xyz } = colorFormatConverter(color, {
    allFormats: true,
    currentFormat: format,
  }) as Formats;

  return {
    hex: hex || "",
    isLocked: false,
    contrastColor: getMainContrastColor(rgb),
    id: makeRandomID(),
    formats: {
      cmyk,
      hsv,
      hsl,
      lab,
      rgb,
      xyz,
    },
    // colorBlind: {
    //   achromatomaly: toColorBlind(hex, "achromatomaly") as string,
    //   achromatopsia: toColorBlind(hex, "achromatopsia") as string,
    //   deuteranomaly: toColorBlind(hex, "deuteranomaly") as string,
    //   deuteranopia: toColorBlind(hex, "deuteranopia") as string,
    //   protanomaly: toColorBlind(hex, "protanomaly") as string,
    //   protanopia: toColorBlind(hex, "protanopia") as string,
    //   tritanomaly: toColorBlind(hex, "tritanomaly") as string,
    //   tritanopia: toColorBlind(hex, "tritanopia") as string,
    // },
  };
}
