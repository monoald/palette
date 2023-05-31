import { colorFormatConverter } from "../lib"
import colorBlind from "../lib/colorBlind"
import { Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from '../lib/types'
import { Color } from "../pages/PaletteGenerator"
import { getMainContrastColor } from "./getMainContrastColor"

export function createNewColor(color: string): Color {
  const formats = colorFormatConverter(color, {
    currentFormat: 'hex',
    AllFormats: true,
  })

  return {
    color: color,
    isLocked: false,
    contrastColor: getMainContrastColor(color),
    id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
    formats: {
      cmyk: formats.cmyk as Cmyk,
      hsb: formats.hsv as Hsv,
      hsl: formats.hsl as Hsl,
      lab: formats.lab as Lab,
      rgb: formats.rgb as Rgb,
      xyz: formats.xyz as Xyz,
    },
    colorBlind: {
      achromatomaly: colorBlind.toAchromatomaly(color) as string,
      achromatopsia: colorBlind.toAchromatopsia(color) as string,
      deuteranomaly: colorBlind.toDeuteranomaly(color) as string,
      deuteranopia: colorBlind.toDeuteranopia(color) as string,
      protanomaly: colorBlind.toProtanomaly(color) as string,
      protanopia: colorBlind.toProtanopia(color) as string,
      tritanomaly: colorBlind.toTritanomaly(color) as string,
      tritanopia: colorBlind.toTritanopia(color) as string
    }
  }
}