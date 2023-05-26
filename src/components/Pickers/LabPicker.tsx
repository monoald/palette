import React from 'react'
import { Color } from '../../pages/PaletteGenerator'

interface LabPickerProps {
  color?: Color
}

export const LabPicker = ({ color }: LabPickerProps) => {
  return (
    <>
    <div className='readonly-message'>
      <span className='icon icon-warning'/>
      <p>Read Only</p>
    </div>

      <div
        className='values-container'
      >
        <div className='element'>
          <p>L:</p>
          <div className='text-box'>
            <p>{color?.formats.lab.l}</p>
          </div>
        </div>

        <div className='element'>
          <p>A:</p>
          <div className='text-box'>
            <p>{color?.formats.lab.a}</p>
          </div>
        </div>

        <div className='element'>
          <p>B:</p>
          <div className='text-box'>
            <p>{color?.formats.lab.b}</p>
          </div>
        </div>
      </div>
    </>
  )
}
