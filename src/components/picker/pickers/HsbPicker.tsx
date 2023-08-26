import { AnyFormat, Hsv, colorFormatConverter } from 'colors-kit'

import { PickerColor } from '../ColorPicker'
import { BackgroundColor, ColorInput } from './StyledRangeInput'

interface HsbPickerProps {
  color?: PickerColor
  updateColor?: (color: AnyFormat, format: string) => void
}

export const HsbPicker = ({ color, updateColor }: HsbPickerProps) => {
  const hsb = color?.formats.hsv as Hsv
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

      updateColor({ h: hueValue, s: saturationValue, v: brightnessValue }, 'hsv')
    }
  }

  return (
    <>
      <div className='value-container'>
        <label className='value'>
          <p>H</p>
          <input
            className='value__input'
            name='hue'
            type='number'
            min={0}
            max={100}
            value={hsb.h}
            onChange={handleHsbChange}
          />
        </label>

        <label className='value'>
          <p>S</p>
          <input
            className='value__input'
            name='saturation'
            type='number'
            min={0}
            max={100}
            value={hsb.s}
            onChange={handleHsbChange}
          />
        </label>

        <label className='value'>
          <p>B</p>
          <input
            className='value__input'
            name='brightness'
            type='number'
            min={0}
            max={100}
            value={hsb.v}
            onChange={handleHsbChange}
          />
        </label>
      </div>

      <div className='sliders-container'>
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
      </div>
    </>
  )
}