import React from 'react'
import { BackgroundColor, ColorInput } from './StyledRangeInputs'
import { AnyFormat, Hsv, colorFormatConverter } from 'colors-kit'
import { Color } from '../../pages/PaletteGenerator'

interface HsbPickerProps {
  color?: Color
  updateColor?: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const HsbPicker = ({ color, updateColor }: HsbPickerProps) => {
  const hsv = color?.formats.hsv as Hsv
  const hex = colorFormatConverter(hsv, { currentFormat: 'hsv', targetFormat: ['hex']}).hex as string

  const saturationBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsv.h, s: 0, v: hsv.v },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsv.h, s: 100, v: hsv.v },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string
  }

  const brightnessBackground: BackgroundColor = {
    start: colorFormatConverter(
      { h: hsv.h, s: hsv.s, v: 0 },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { h: hsv.h, s: hsv.s, v: 100 },
      { currentFormat: 'hsv', targetFormat: ['hex'] }
    ).hex as string
  }

  function handleHsbChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (updateColor) {
      const target = event.target as HTMLInputElement
      const identifier = target.name || target.id

      const hueValue = identifier === 'hue' ? +target.value : hsv.h
      const saturationValue = identifier === 'saturation' ? +target.value : hsv.s
      const brightnessValue = identifier === 'brightness' ? +target.value : hsv.v

      updateColor({ h: hueValue, s: saturationValue, v: brightnessValue }, 'hsv', true)
    }
  }

  return (
    <>
      <ColorInput
        id='hue'
        min={0}
        max={360}
        value={hsv.h as number}
        onChange={handleHsbChange}
        isHue
      />
      <ColorInput
        id='saturation'
        min={0}
        max={100}
        value={hsv.s}
        onChange={handleHsbChange}
        thumbColor={hex}
        backgroundColor={`${saturationBackground.start}, ${saturationBackground.end}`}
      />
      <ColorInput
        id='brightness'
        min={0}
        max={100}
        value={hsv.v}
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
            value={hsv.h}
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
            value={hsv.s}
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
            value={hsv.v}
            onChange={handleHsbChange}
          />
        </label>
      </div>
    </>
  )
}