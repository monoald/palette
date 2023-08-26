import { AnyFormat, Rgb, colorFormatConverter } from 'colors-kit'

import { PickerColor } from '../ColorPicker'
import { BackgroundColor, ColorInput } from './StyledRangeInput'

interface RgbPickerProps {
  color?: PickerColor
  updateColor?: (color: AnyFormat, format: string) => void
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

      updateColor({ r: redValue, g: greenValue, b: blueValue }, 'rgb')
    }
  }

  return (
    <>
      <div className='value-container'>
        <label className='value'>
          <p>R</p>
          <input
            className='value__input'
            name='red'
            type='number'
            min={0}
            max={255}
            value={rgb.r}
            onChange={handleRgbChange}
          />
        </label>

        <label className='value'>
          <p>G</p>
          <input
            className='value__input'
            name='green'
            type='number'
            min={0}
            max={255}
            value={rgb.g}
            onChange={handleRgbChange}
          />
        </label>

        <label className='value'>
          <p>B</p>
          <input
            className='value__input'
            name='blue'
            type='number'
            min={0}
            max={255}
            value={rgb.b}
            onChange={handleRgbChange}
          />
        </label>
      </div>

      <div className='sliders-container'>
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
      </div>
    </>
  )
}