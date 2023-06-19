import { AnyFormat, BaseColor, Cmyk, Hsl, Hsv, Lab, Rgb, Xyz, colorFormatConverter, toColorBlind } from 'colors-kit'
import { Color } from '../pages/PaletteGenerator'
import { getMainContrastColor } from './getMainContrastColor'

export function createNewColor(color: AnyFormat, format: string): Color {
  const hex = format === 'hex' ? color as string : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['hex'] }).hex as string
  const cmyk = format === 'cmyk' ? color as Cmyk : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['cmyk'] }).cmyk as Cmyk
  const hsb = format === 'hsb' ? color as Hsv : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['hsv'] }).hsv as Hsv
  const hsl = format === 'hsl' ? color as Hsl : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['hsl'] }).hsl as Hsl
  const lab = format === 'lab' ? color as Lab : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['lab'] }).lab as Lab
  const rgb = format === 'rgb' ? color as Rgb : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['rgb'] }).rgb as Rgb
  const xyz = format === 'xyz' ? color as Xyz : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['xyz'] }).xyz as Xyz

  return {
    color: hex,
    isLocked: false,
    contrastColor: getMainContrastColor(hex),
    id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
    formats: {
      cmyk,
      hsb,
      hsl,
      lab,
      rgb,
      xyz,
    },
    colorBlind: {
      achromatomaly: toColorBlind(hex, 'achromatomaly') as string,
      achromatopsia: toColorBlind(hex, 'achromatopsia') as string,
      deuteranomaly: toColorBlind(hex, 'deuteranomaly') as string,
      deuteranopia: toColorBlind(hex, 'deuteranopia') as string,
      protanomaly: toColorBlind(hex, 'protanomaly') as string,
      protanopia: toColorBlind(hex, 'protanopia') as string,
      tritanomaly: toColorBlind(hex, 'tritanomaly') as string,
      tritanopia: toColorBlind(hex, 'tritanopia') as string
    }
  }
}