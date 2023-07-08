import React, { useEffect, useState } from 'react'
import { AnyFormat } from 'colors-kit'

import { ColorInput } from './StyledRangeInputs'
import { Color } from '../../pages/PaletteGenerator'

import '../../styles/HexadecimalPicker.css'

interface HexadecimalPickerProps {
  color?: Color
  updateColor?: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const HexadecimalPicker = ({ color, updateColor }: HexadecimalPickerProps) => {
  const [hexColor, setHexColor] = useState('')

  useEffect(() => {
    setHexColor(color?.color.toUpperCase() as string)
  }, [color])

  function handleHueChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (updateColor) {
      const target = event.target as HTMLInputElement

      const hueValue = +target.value
      
      updateColor({
        h: hueValue,
        s: color?.formats.hsb.s as number,
        v: color?.formats.hsb.v as number
      }, 'hsb', false)
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
      // validateHex(inputValue)

      updateColor(inputValue, 'hex', true)
    }
  }

  return (
    <>
      <ColorInput
        id='hue'
        min={0}
        max={360}
        value={color?.formats.hsb.h as number}
        onChange={handleHueChange}
        isHue
      />

      <input
        className='input'
        type='text'
        value={hexColor}
        onChange={handleHexChange}
        maxLength={7}
      />
    </>
  )
}
