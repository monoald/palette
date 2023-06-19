import React from 'react'
import { AnyFormat } from 'colors-kit'
import { Color } from '../../pages/PaletteGenerator'

interface PickerContanerProps {
  color: Color
  updateColor: (color: AnyFormat, format: string, moveThumb: boolean) => void
  children: JSX.Element[]
}

export const PickerContainer = ({ color, updateColor, children }: PickerContanerProps) => {
  return (
    <>
      {React.Children.map(children, child => {
          return React.cloneElement(child, { color, updateColor })
      })}
    </>
  )
}