import { ColorFormats, WCAGRequierements, colorFormatConverter, hexToRgb, makeAnalogousPalette, makeComplementaryPalette, makeMonochromaticPalette, makeSplitComplementaryPalette, makeSquarePalette, makeTetradicPalette, makeTriadicPalette, rateContrast, toAchromatomaly, toAchromatopsia, toDeuteranomaly, toDeuteranopia, toProtanomaly, toProtanopia, toTritanomaly, toTritanopia } from "colors-kit"
import { getMainContrastColor } from "./getMainContrastColor"

export interface Palettes {
  [key: string]: string[]
}

export interface ColorBlind {
  [key: string]: string
}

export interface ColorType {
  color: string
  mainContrastColor: string
  currentContrastColor: string
  contrastRate: WCAGRequierements
  allFormats: ColorFormats,
  palettes: Palettes,
  colorBlind: ColorBlind
}

export function createColor(id: string): ColorType {
  const hex = `#${id}`
  const mainContrast = getMainContrastColor(hex)
  const color: ColorType = {
    color: hex,
    mainContrastColor: mainContrast,
    currentContrastColor: mainContrast,
    contrastRate: rateContrast([
      hexToRgb(hex),
      hexToRgb(mainContrast)
    ]),
    allFormats: colorFormatConverter(hex, {
      currentFormat: 'hex',
      allFormats: true,
    }),
    palettes: {
      analogous: makeAnalogousPalette(hex, 4) as string[],
      complementary: makeComplementaryPalette(hex) as string[],
      monochromatic: makeMonochromaticPalette(hex, 4, 80) as string[],
      ['split-complementary']: makeSplitComplementaryPalette(hex) as string[],
      square: makeSquarePalette(hex) as string[],
      tetradic: makeTetradicPalette(hex) as string[],
      triadic: makeTriadicPalette(hex) as string[],
    },
    colorBlind: {
      achromatomaly: toAchromatomaly(hex) as string,
      achromatopsia: toAchromatopsia(hex) as string,
      deuteranomaly: toDeuteranomaly(hex) as string,
      deuteranopia: toDeuteranopia(hex) as string,
      protanomaly: toProtanomaly(hex) as string,
      protanopia: toProtanopia(hex) as string,
      tritanomaly: toTritanomaly(hex) as string,
      tritanopia: toTritanopia(hex)  as string
    }
  }

  return color
}