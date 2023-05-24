import React from 'react'
import { BackgroundColor, ColorInput } from './StyledRangeInputs'
import { colorFormatConverter } from '../../lib'
import { AnyFormat, Cmyk } from '../../lib/types'
import { Color } from '../../pages/PaletteGenerator'

interface CmykPickerProps {
  color?: Color
  updateColor?: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const CmykPicker = ({ color, updateColor }: CmykPickerProps) => {
  const cmyk = color?.formats.cmyk as Cmyk
  const hex = colorFormatConverter(cmyk, { currentFormat: 'cmyk', targetFormat: ['hex']}).hex as string


  const cyanBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: 0, m: cmyk.m, y: cmyk?.y, k: cmyk.k},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { c: 100, m: cmyk.m, y: cmyk?.y, k: cmyk.k},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string
  }

  const magentaBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: cmyk.c, m: 0, y: cmyk?.y, k: cmyk.k},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { c: cmyk.c, m: 100, y: cmyk?.y, k: cmyk.k},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string
  }

  const yellowBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: 0, k: cmyk.k},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: 100, k: cmyk.k},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string
  }

  const keyBackground: BackgroundColor = {
    start: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: cmyk?.y, k: 0},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { c: cmyk.c, m: cmyk.m, y: cmyk?.y, k: 100},
      { currentFormat: 'cmyk', targetFormat: ['hex'] }
    ).hex as string
  }

  function handleCmykChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (updateColor) {
      const target = event.target as HTMLInputElement

      const cyanValue = target.id === 'cyan' ? +target.value : cmyk.c
      const magentaValue = target.id === 'magenta' ? +target.value : cmyk.m
      const yellowValue = target.id === 'yellow' ? +target.value : cmyk.y
      const keyValue = target.id === 'key' ? +target.value : cmyk.k

      updateColor({ c: cyanValue, m: magentaValue, y: yellowValue, k: keyValue }, 'cmyk', true)
    }
  }

  return (
    <>
      <ColorInput
        id='cyan'
        min={0}
        max={100}
        value={cmyk.c}
        onChange={handleCmykChange}
        thumbColor={hex}
        backgroundColor={`${cyanBackground.start}, ${cyanBackground.end}`}
      />
      <ColorInput
        id='magenta'
        min={0}
        max={100}
        value={cmyk.m}
        onChange={handleCmykChange}
        thumbColor={hex}
        backgroundColor={`${magentaBackground.start}, ${magentaBackground.end}`}
      />
      <ColorInput
        id='yellow'
        min={0}
        max={100}
        value={cmyk.y}
        onChange={handleCmykChange}
        thumbColor={hex}
        backgroundColor={`${yellowBackground.start}, ${yellowBackground.end}`}
      />
      <ColorInput
        id='key'
        min={0}
        max={100}
        value={cmyk.k}
        onChange={handleCmykChange}
        thumbColor={hex}
        backgroundColor={`${keyBackground.start}, ${keyBackground.end}`}
      />
    </>
  )
}
