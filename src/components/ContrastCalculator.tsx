/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { WCAGRequierements, rateContrast } from '../lib/rate/rateContrast'
import { hexToRgb } from '../lib'
import { ContrastTable } from './ContrastTable'
import { Modal } from './Modal'
import { ColorPicker } from './ColorPicker'
import '../styles/ContrastCalculator.css'
import { getBaseColor } from '../lib/utils/getBaseColor'
import { Hsl } from '../lib/types'
import { getMainContrastColor } from '../utils/getMainContrastColor'

interface ContrastCalculatorProps {
  color: ContrastColor
  setColor: React.Dispatch<React.SetStateAction<ContrastColor>>
  CloseModalButton?: React.ElementType
  setModalContrast: React.Dispatch<React.SetStateAction<boolean>>
  colorsLength: number
}

interface ContrastColor {
  color: string
  primaryColorContrast: string,
  id: number
}


export const ContrastCalculator = ({ color, setColor, CloseModalButton, setModalContrast, colorsLength }: ContrastCalculatorProps) => {
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false)
  const [secondaryColor, setSecondaryColor] = useState<ContrastColor>({
    color: color.primaryColorContrast,
    primaryColorContrast: getMainContrastColor(color.primaryColorContrast),
    id: colorsLength
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

  function getBaseHue(colorHex: string) {
    const hue = getBaseColor(colorHex, { targetFormat: 'hsl' }) as Hsl
    return hue.h
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
                color: color.primaryColorContrast === '#000000' ? '#1A1B25' :   '#fff',
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
                color: secondaryColor.primaryColorContrast  === '#000000' ? '#1A1B25' :   '#fff',
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
          {CloseModalButton &&
            <CloseModalButton />
          }
        </div>
      </Modal>
      { openColorPicker &&
          <ColorPicker
            setOpenColorPicker={setOpenColorPicker}
            color={updatedColor === 'primary' ? color.color : secondaryColor.color}
            setColor={updatedColor === 'primary' ? setColor : setSecondaryColor}
            hue={updatedColor === 'primary' ? getBaseHue(color.color) : getBaseHue(color.primaryColorContrast)}
          />
      }
    </>
  )
}