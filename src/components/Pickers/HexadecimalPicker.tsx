import React from "react"
import { ColorInput } from "./StyledRangeInputs"
import { AnyFormat } from "../../lib/types"
import { Color } from "../../pages/PaletteGenerator"

interface HexadecimalPickerProps {
  color?: Color
  updateColor?: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const HexadecimalPicker = ({ color, updateColor }: HexadecimalPickerProps) => {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  return (
    <>
      <ColorInput
        id="hue"
        min={0}
        max={360}
        value={color?.formats.hsb.h as number}
        onChange={handleChange}
        isHue
      />
      <input type="text" value={color?.color.toUpperCase()}
        onChange={() => 'a'}
        style={{
          height: '33px',
          width: '180px',
          margin: 'auto',
          borderRadius: '8px',
          border: '1px solid rgba(232, 233, 243, 0.4)',
          background: 'transparent',
          fontSize: '20px',
          letterSpacing: '1.2px',
          textAlign: 'center'
        }}
      />
    </>
  )
}
