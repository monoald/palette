import React from 'react'
import { Color } from '../../pages/PaletteGenerator'

interface XyzPickerProps {
  color?: Color
}

export const XyzPicker = ({ color }: XyzPickerProps) => {
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
          <p>X:</p>
          <div className='text-box'>
            <p>{color?.formats.xyz.x}</p>
          </div>
        </div>

        <div className='element'>
          <p>Y:</p>
          <div className='text-box'>
            <p>{color?.formats.xyz.y}</p>
          </div>
        </div>

        <div className='element'>
          <p>Z:</p>
          <div className='text-box'>
            <p>{color?.formats.xyz.z}</p>
          </div>
        </div>
      </div>
    </>
  )
}
