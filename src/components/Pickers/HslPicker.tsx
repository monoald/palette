import React from 'react'
import { BackgroundColor, ColorInput } from './StyledRangeInputs'
import { AnyFormat, Hsl, colorFormatConverter } from 'colors-kit'
import { Color } from '../../pages/PaletteGenerator'

interface HslPickerProps {
  color?: Color
  updateColor?: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const HslPicker = ({ color, updateColor }: HslPickerProps) => {
  const hsl = color?.formats.hsl as Hsl
  const hex = colorFormatConverter(hsl, { currentFormat: 'hsl', targetFormat: ['hex']}).hex as string

  const saturationBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsl.h, s: 0, l: hsl.l },
      { currentFormat: 'hsl', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsl.h, s: 100, l: hsl.l },
      { currentFormat: 'hsl', targetFormat: ['hex'] }
    ).hex as string
  }

  const lightnessBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsl.h, s: hsl.s, l: 0 },
      { currentFormat: 'hsl', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsl.h, s: hsl.s, l: 50 },
      { currentFormat: 'hsl', targetFormat: ['hex'] }
    ).hex as string
  }

  function handleHslChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (updateColor) {
      const target = event.target as HTMLInputElement
      const identifier = target.name || target.id

      const hueValue = identifier === 'hue' ? +target.value : hsl.h
      const saturationValue = identifier === 'saturation' ? +target.value : hsl.s
      const lightnessValue = identifier === 'lightness' ? +target.value : hsl.l

      updateColor({ h: hueValue, s: saturationValue, l: lightnessValue }, 'hsl', true)
    }
  }

  return (
    <>
      <ColorInput
        id='hue'
        min={0}
        max={360}
        value={hsl.h as number}
        onChange={handleHslChange}
        isHue
      />
      <ColorInput
        id='saturation'
        min={0}
        max={100}
        value={hsl.s}
        onChange={handleHslChange}
        thumbColor={hex}
        backgroundColor={`${saturationBackground.start}, ${saturationBackground.end}`}
      />
      <ColorInput
        id='lightness'
        min={0}
        max={100}
        value={hsl.l}
        onChange={handleHslChange}
        thumbColor={hex}
        backgroundColor={`${lightnessBackground.start}, ${lightnessBackground.end}, #fff`}
      />

      <div className='text-input-container'>
        <label className='text-input'>
          <p className='text-input__label'>
            H:
          </p>
          <input
            className='text-input__box'
            name='hue'
            type='number'
            min={0}
            max={100}
            value={hsl.h}
            onChange={handleHslChange}
          />
        </label>

        <label className='text-input'>
          <p className='text-input__label'>
            S:
          </p>
          <input
            className='text-input__box'
            name='saturation'
            type='number'
            min={0}
            max={100}
            value={hsl.s}
            onChange={handleHslChange}
          />
        </label>

        <label className='text-input'>
          <p className='text-input__label'>
            L:
          </p>
          <input
            className='text-input__box'
            name='lightness'
            type='number'
            min={0}
            max={100}
            value={hsl.l}
            onChange={handleHslChange}
          />
        </label>
      </div>
    </>
  )
}
