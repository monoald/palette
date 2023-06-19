import React, { useEffect, useState } from 'react'
import { ColorInput } from './StyledRangeInputs'
import { AnyFormat } from 'colors-kit'
import { Color } from '../../pages/PaletteGenerator'

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

      <input type='text'
        value={hexColor}
        onChange={handleHexChange}
        style={{
          height: '33px',
          width: '180px',
          // margin: 'auto',
          borderRadius: '8px',
          border: '1px solid rgba(232, 233, 243, 0.4)',
          background: 'transparent',
          fontSize: '20px',
          letterSpacing: '1.2px',
          textAlign: 'center'
        }}
        maxLength={7}
      />
    </>
  )
}
