import { getMainContrastColor } from "@/app/utils/createColorObject";
import {
  ColorFormats,
  WCAGRequierements,
  colorFormatConverter,
  hexToRgb,
  makeAnalogousPalette,
  makeComplementaryPalette,
  makeMonochromaticPalette,
  makeSplitComplementaryPalette,
  makeSquarePalette,
  makeTetradicPalette,
  makeTriadicPalette,
  rateContrast,
  toAchromatomaly,
  toAchromatopsia,
  toDeuteranomaly,
  toDeuteranopia,
  toProtanomaly,
  toProtanopia,
  toTritanomaly,
  toTritanopia,
} from "colors-kit";

export interface Palettes {
  [key: string]: string[];
}

export interface ColorBlind {
  [key: string]: string;
}

export interface ColorSpec {
  color: string;
  mainContrastColor: string;
  currentContrastColor: string;
  contrastRate: WCAGRequierements;
  allFormats: ColorFormats;
  palettes: Palettes;
  colorBlind: ColorBlind;
}

export function createColor(id: string): ColorSpec {
  const hex = `#${id}`;
  const mainContrast = getMainContrastColor(hexToRgb(hex));
  const color: ColorSpec = {
    color: hex,
    mainContrastColor: mainContrast,
    currentContrastColor: mainContrast,
    contrastRate: rateContrast([hexToRgb(hex), hexToRgb(mainContrast)]),
    allFormats: colorFormatConverter(hex, {
      currentFormat: "hex",
      allFormats: true,
    }),
    palettes: {
      analogous: makeAnalogousPalette({
        color: hex,
        quantity: 4,
        format: "hex",
      }) as string[],
      complementary: makeComplementaryPalette({
        color: hex,
        quantity: 4,
        format: "hex",
      }) as string[],
      monochromatic: makeMonochromaticPalette({
        color: hex,
        quantity: 4,
        format: "hex",
      }) as string[],
      ["split-complementary"]: makeSplitComplementaryPalette({
        color: hex,
        quantity: 4,
        format: "hex",
      }) as string[],
      square: makeSquarePalette({
        color: hex,
        quantity: 4,
        format: "hex",
      }) as string[],
      tetradic: makeTetradicPalette({
        color: hex,
        quantity: 4,
        format: "hex",
      }) as string[],
      triadic: makeTriadicPalette({
        color: hex,
        quantity: 4,
        format: "hex",
      }) as string[],
    },
    colorBlind: {
      achromatomaly: toAchromatomaly(hex) as string,
      achromatopsia: toAchromatopsia(hex) as string,
      deuteranomaly: toDeuteranomaly(hex) as string,
      deuteranopia: toDeuteranopia(hex) as string,
      protanomaly: toProtanomaly(hex) as string,
      protanopia: toProtanopia(hex) as string,
      tritanomaly: toTritanomaly(hex) as string,
      tritanopia: toTritanopia(hex) as string,
    },
  };

  return color;
}
