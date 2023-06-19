import React from 'react'
import { BackgroundColor, ColorInput } from './StyledRangeInputs'
import { AnyFormat, Rgb, colorFormatConverter } from 'colors-kit'
import { Color } from '../../pages/PaletteGenerator'

interface RgbPickerProps {
  color?: Color
  updateColor?: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const RgbPicker = ({ color, updateColor }: RgbPickerProps) => {
  const rgb = color?.formats.rgb as Rgb
  const hex = colorFormatConverter(rgb, { currentFormat: 'rgb', targetFormat: ['hex']}).hex as string

  const redBackground: BackgroundColor = {
    start: colorFormatConverter(
      { r: 0, g: rgb.g, b: rgb.b },
      { currentFormat: 'rgb', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { r: 255, g: rgb.g, b: rgb.b },
      { currentFormat: 'rgb', targetFormat: ['hex'] }
    ).hex as string
  }

  const greenBackground: BackgroundColor = {
    start: colorFormatConverter(
      { r: rgb.r, g: 0, b: rgb.b },
      { currentFormat: 'rgb', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { r: rgb.r, g: 255, b: rgb.b },
      { currentFormat: 'rgb', targetFormat: ['hex'] }
    ).hex as string
  }

  const blueBackground: BackgroundColor = {
    start: colorFormatConverter(
      { r: rgb.r, g: rgb.g, b: 0 },
      { currentFormat: 'rgb', targetFormat: ['hex'] }
    ).hex as string,
    end: colorFormatConverter(
      { r: rgb.r, g: rgb.g, b: 255 },
      { currentFormat: 'rgb', targetFormat: ['hex'] }
    ).hex as string
  }

  function handleRgbChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (updateColor) {
      const target = event.target as HTMLInputElement
      const identifier = target.name || target.id

      const redValue = identifier === 'red' ? +target.value : rgb.r
      const greenValue = identifier === 'green' ? +target.value : rgb.g
      const blueValue = identifier === 'blue' ? +target.value : rgb.b

      updateColor({ r: redValue, g: greenValue, b: blueValue }, 'rgb', true)
    }
  }

  return (
    <>
      <ColorInput
        id='red'
        min={0}
        max={255}
        value={rgb.r}
        onChange={handleRgbChange}
        thumbColor={hex}
        backgroundColor={`${redBackground.start}, ${redBackground.end}`}
      />
      <ColorInput
        id='green'
        min={0}
        max={255}
        value={rgb.g}
        onChange={handleRgbChange}
        thumbColor={hex}
        backgroundColor={`${greenBackground.start}, ${greenBackground.end}`}
      />
      <ColorInput
        id='blue'
        min={0}
        max={255}
        value={rgb.b}
        onChange={handleRgbChange}
        thumbColor={hex}
        backgroundColor={`${blueBackground.start}, ${blueBackground.end}`}
      />

      <div className='text-input-container'>
        <label className='text-input'>
          <p className='text-input__label'>
            R:
          </p>
          <input
            className='text-input__box'
            name='red'
            type='number'
            min={0}
            max={255}
            value={rgb.r}
            onChange={handleRgbChange}
          />
        </label>

        <label className='text-input'>
          <p className='text-input__label'>
            G:
          </p>
          <input
            className='text-input__box'
            name='green'
            type='number'
            min={0}
            max={255}
            value={rgb.g}
            onChange={handleRgbChange}
          />
        </label>

        <label className='text-input'>
          <p className='text-input__label'>
            B:
          </p>
          <input
            className='text-input__box'
            name='blue'
            type='number'
            min={0}
            max={255}
            value={rgb.b}
            onChange={handleRgbChange}
          />
        </label>
      </div>
    </>
  )
}