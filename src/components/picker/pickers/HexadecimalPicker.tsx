import { useEffect, useState } from 'react'
import { AnyFormat } from 'colors-kit'

import { PickerColor } from '../ColorPicker'
import { ColorInput } from './StyledRangeInput'

interface HexadecimalPickerProps {
  color?: PickerColor
  updateColor?: (color: AnyFormat, format: string) => void
}

export const HexadecimalPicker = ({ color, updateColor }: HexadecimalPickerProps) => {
  const [hexColor, setHexColor] = useState('')

  useEffect(() => {
    setHexColor(color?.formats.hex?.toUpperCase() as string)
  }, [color])

  function handleHueChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (updateColor) {
      const target = event.target as HTMLInputElement

      const hueValue = +target.value
      
      updateColor({
        h: hueValue,
        s: color?.formats.hsv?.s as number,
        v: color?.formats.hsv?.v as number
      }, 'hsv')
    }
  }

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value

    // Ensure the first character is '#'
    if (inputValue.length === 0 || inputValue[0] !== '#') {
      inputValue = '#' + inputValue
    }

    setHexColor(inputValue)

    if (updateColor && inputValue.length === 7) {
      updateColor(inputValue, 'hex')
    }
  }

  return (
    <>
      <input
        className='input'
        type='text'
        value={hexColor}
        onChange={handleHexChange}
        maxLength={7}
        style={{
          width: '100%',
          border: '1px solid var(--txt-inactive)',
          fontSize: '1.6rem',
          letterSpacing: '0.6px'
        }}
      />

      <ColorInput
        id='hue'
        min={0}
        max={360}
        value={color?.formats.hsv?.h as number}
        onChange={handleHueChange}
        isHue
      />
    </>
  )
}