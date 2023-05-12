import React, { useEffect, useState } from 'react'
import { WCAGRequierements, rateContrast } from '../lib/rate/rateContrast'
import { hexToRgb } from '../lib'
import { ContrastTable } from './ContrastTable'
import { Modal } from './Modal'
import '../styles/ContrastCalculator.css'

interface ContrastCalculatorProps {
  color: ContrastColor
  CloseModalButton?: React.ElementType
  setModalContrast: React.Dispatch<React.SetStateAction<boolean>>
}

interface ContrastColor {
  color: string
  primaryColorContrast: string
}


export const ContrastCalculator = ({ color, CloseModalButton, setModalContrast }: ContrastCalculatorProps) => {
  const [primaryColor, setPrimaryColor] = useState<string>('')
  const [secondaryColor, setSecondaryColor] = useState<string>('')
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
    const secondaryRgb = hexToRgb(color.primaryColorContrast)
    const contrast = rateContrast([colorRgb, secondaryRgb ])

    setContrast(contrast)
    setPrimaryColor(color.color)
    setSecondaryColor(color.primaryColorContrast)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            >
              {primaryColor}
            </button>

            <button
              className='color-button color-button--secondary'
              style={{
                backgroundColor: color.primaryColorContrast,
                color: color.primaryColorContrast === '#000000' ? '#fff' : '#1A1B25'
              }}
            >
              {secondaryColor}
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
    </>
  )
}