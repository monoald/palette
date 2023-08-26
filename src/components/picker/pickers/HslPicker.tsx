import { AnyFormat, Hsl, colorFormatConverter, hslToHex } from 'colors-kit'
import { PickerColor } from '../ColorPicker'
import { BackgroundColor, ColorInput } from './StyledRangeInput'

interface HslPickerProps {
  color?: PickerColor
  updateColor?: (color: AnyFormat, format: string) => void
}

export const HslPicker = ({ color, updateColor }: HslPickerProps) => {
  const hsl = color?.formats.hsl as Hsl
  const hex = hslToHex(hsl)

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

      updateColor({ h: hueValue, s: saturationValue, l: lightnessValue }, 'hsl')
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
            value={hsl.h}
            onChange={handleHslChange}
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
            value={hsl.s}
            onChange={handleHslChange}
          />
        </label>

        <label className='value'>
          <p>L</p>
          <input
            className='value__input'
            name='lightness'
            type='number'
            min={0}
            max={100}
            value={hsl.l}
            onChange={handleHslChange}
          />
        </label>
      </div>

      <div className='sliders-container'>
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
      </div>
    </>
  )
}