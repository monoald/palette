import React from 'react'
import { BackgroundColor, ColorInput } from './StyledRangeInputs'
import { AnyFormat, Hsv, colorFormatConverter } from 'colors-kit'
import { Color } from '../../pages/PaletteGenerator'

interface HsbPickerProps {
  color?: Color
  updateColor?: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const HsbPicker = ({ color, updateColor }: HsbPickerProps) => {
  const hsb = color?.formats.hsb as Hsv
  const hex = colorFormatConverter(hsb, { currentFormat: 'hsv', targetFormat: ['hex']}).hex as string

  const saturationBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsb.h, s: 0, v: hsb.v },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsb.h, s: 100, v: hsb.v },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string
  }

  const brightnessBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsb.h, s: hsb.s, v: 0 },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsb.h, s: hsb.s, v: 100 },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string
  }

  function handleHsbChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (updateColor) {
      const target = event.target as HTMLInputElement
      const identifier = target.name || target.id

      const hueValue = identifier === 'hue' ? +target.value : hsb.h
      const saturationValue = identifier === 'saturation' ? +target.value : hsb.s
      const brightnessValue = identifier === 'brightness' ? +target.value : hsb.v

      updateColor({ h: hueValue, s: saturationValue, v: brightnessValue }, 'hsb', true)
    }
  }

  return (
    <>
      <ColorInput
        id='hue'
        min={0}
        max={360}
        value={hsb.h as number}
        onChange={handleHsbChange}
        isHue
      />
      <ColorInput
        id='saturation'
        min={0}
        max={100}
        value={hsb.s}
        onChange={handleHsbChange}
        thumbColor={hex}
        backgroundColor={`${saturationBackground.start}, ${saturationBackground.end}`}
      />
      <ColorInput
        id='brightness'
        min={0}
        max={100}
        value={hsb.v}
        onChange={handleHsbChange}
        thumbColor={hex}
        backgroundColor={`${brightnessBackground.start}, ${brightnessBackground.end}`}
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
            value={hsb.h}
            onChange={handleHsbChange}
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
            value={hsb.s}
            onChange={handleHsbChange}
          />
        </label>

        <label className='text-input'>
          <p className='text-input__label'>
            B:
          </p>
          <input
            className='text-input__box'
            name='brightness'
            type='number'
            min={0}
            max={100}
            value={hsb.v}
            onChange={handleHsbChange}
          />
        </label>
      </div>
    </>
  )
}