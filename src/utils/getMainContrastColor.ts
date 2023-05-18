import { hexToRgb } from "../lib"
import { rateContrast } from "../lib/rate/rateContrast"

export function getMainContrastColor(color: string): string {
  const rgb = hexToRgb(color)
  const whiteContrast = rateContrast([{ r: 255, g: 255, b: 255}, rgb ]).contrastValue
  const blackContrast = rateContrast([{ r: 0, g: 0, b: 0}, rgb ]).contrastValue
  
  const mainContrastColor = whiteContrast > blackContrast ? '#ffffff' : '#000000'

  return mainContrastColor
}