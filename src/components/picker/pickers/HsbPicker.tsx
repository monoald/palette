import { AnyFormat, Hsv, colorFormatConverter } from 'colors-kit'

import { PickerColor } from '../ColorPicker'
import { BackgroundColor, ColorInput } from './StyledRangeInput'

interface HsbPickerProps {
  color?: PickerColor
  updateColor?: (color: AnyFormat, format: string) => void
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
            value={hsv.h}
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
            value={hsv.s}
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
            value={hsv.v}
            onChange={handleHsbChange}
          />
        </label>
      </div>

      <div className='sliders-container'>
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
      </div>
    </>
  )
}