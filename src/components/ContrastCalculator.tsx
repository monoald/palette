/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { WCAGRequierements, rateContrast } from '../lib/rate/rateContrast'
import { hexToRgb } from '../lib'
import { ContrastTable } from './ContrastTable'
import { Modal } from './Modal'
import { ColorPicker } from './colorPicker/ColorPicker'
import '../styles/ContrastCalculator.css'
import { getMainContrastColor } from '../utils/getMainContrastColor'
import { Color } from '../pages/PaletteGenerator'
import { CloseModalButton } from './CloseModalButton'

interface ContrastCalculatorProps {
  color: Color
  setColor: React.Dispatch<React.SetStateAction<Color>>
  // CloseModalButton?: React.ElementType
  setModalContrast: React.Dispatch<React.SetStateAction<boolean>>
  colorsLength: number
}

export const ContrastCalculator = ({ color, setColor, setModalContrast, colorsLength }: ContrastCalculatorProps) => {
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false)
  const [secondaryColor, setSecondaryColor] = useState<Color>({
    color: color.contrastColor,
    isLocked: false,
    contrastColor: getMainContrastColor(color.contrastColor),
    id: colorsLength,
    formats: color.formats
  })

  const [updatedColor, setUpdatedColor] = useState<string>('')
  const [contrast, setContrast] = useState<WCAGRequierements>({
    contrastValue: 0,
    AA: {
      smallTextMinimum: 0,
      smallText: false,

      largeTextMinimum: 0,
      largeText: false,

      uiComponentMinimum: 0,
      uiComponent: false
    },
    AAA: {
      smallTextMinimum: 0,
      smallText: false,

      largeTextMinimum: 0,
      largeText: false,
      uiComponentMinimum: 0,
      uiComponent: false
    }
  })
  useEffect(() => {
    const colorRgb = hexToRgb(color.color)
    const secondaryRgb = hexToRgb(secondaryColor.color)
    const contrast = rateContrast([colorRgb, secondaryRgb ])

    setContrast(contrast)
  }, [secondaryColor, color])

  function handleColorPicker(newColor: string) {
    setOpenColorPicker(!openColorPicker)
    setUpdatedColor(newColor)
  }

  return (
    <>
      <Modal setModal={setModalContrast} backgroundOpacity={0.4}>
        <div className='Contrast-Calculator'>
          <div className='buttons-container'>
            <button
              className='color-button color-button--primary'
              style={{
                backgroundColor: color.color,
                color: color.contrastColor === '#000000' ? '#1A1B25' :   '#fff',
                border: color.color === '#1a1b25' ? '1px solid rgba(200, 200, 200, 0.3)' : 'none'
              }}
              onClick={() => handleColorPicker('primary')}
            >
              {color.color}
            </button>

            <button
              className='color-button color-button--secondary'
              style={{
                backgroundColor: secondaryColor.color,
                color: secondaryColor.contrastColor  === '#000000' ? '#1A1B25' :   '#fff',
                border: secondaryColor.color === '#1a1b25' ? '1px solid rgba(200, 200, 200, 0.3)' : 'none'
              }}
              onClick={() => handleColorPicker('secondary')}
            >
              {secondaryColor.color}
            </button>
          </div>

          <div className='wcag-info'>
            <div className='contrast-container'>
              <p className='value'>
                <b>CONTRAST RATIO:</b> {contrast.contrastValue}:1
              </p>
            </div>
            <ContrastTable contrast={contrast} />
          </div>

          <CloseModalButton setModal={setModalContrast} />
        </div>
      </Modal>
      { openColorPicker &&
          <ColorPicker
            setModalColorPicker={setOpenColorPicker}
            color={updatedColor === 'primary' ? color : secondaryColor}
            setColor={updatedColor === 'primary' ? setColor : setSecondaryColor}
          />
      }
    </>
  )
}