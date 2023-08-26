import { AnyFormat, Cmyk, colorFormatConverter } from 'colors-kit'

import { PickerColor } from '../ColorPicker'
import { BackgroundColor, ColorInput } from './StyledRangeInput'

interface CmykPickerProps {
  color?: PickerColor
  updateColor?: (color: AnyFormat, format: string) => void
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
      const identifier = target.name || target.id

      const cyanValue = identifier === 'cyan' ? +target.value : cmyk.c

      const magentaValue =identifier === 'magenta' ? +target.value : cmyk.m

      const yellowValue =identifier === 'yellow' ? +target.value : cmyk.y

      const keyValue =identifier === 'key' ? +target.value : cmyk.k

      updateColor({ c: cyanValue, m: magentaValue, y: yellowValue, k: keyValue }, 'cmyk')
    }
  }

  return (
    <>
      <div className='value-container'>
        <label className='value'>
          <p>C</p>
          <input
            className='value__input'
            name='cyan'
            type='number'
            min={0}
            max={100}
            value={cmyk.c}
            onChange={handleCmykChange}
          />
        </label>

        <label className='value'>
          <p>M</p>
          <input
            className='value__input'
            name='magenta'
            type='number'
            min={0}
            max={100}
            value={cmyk.m}
            onChange={handleCmykChange}
          />
        </label>

        <label className='value'>
          <p>Y</p>
          <input
            className='value__input'
            name='yellow'
            type='number'
            min={0}
            max={100}
            value={cmyk.y}
            onChange={handleCmykChange}
          />
        </label>

        <label className='value'>
          <p>K</p>
          <input
            className='value__input'
            name='key'
            type='number'
            min={0}
            max={100}
            value={cmyk.k}
            onChange={handleCmykChange}
          />
        </label>
      </div>

      <div className='sliders-container'>
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
      </div>

    </>
  )
}