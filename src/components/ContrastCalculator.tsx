/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { WCAGRequierements, rateContrast } from '../lib/rate/rateContrast'
import { hexToRgb } from '../lib'
import { ContrastTable } from './ContrastTable'
import { Modal } from './Modal'
import { ColorPicker } from './colorPicker/ColorPicker'
import '../styles/ContrastCalculator.css'
import { CloseModalButton } from './CloseModalButton'
import { ColorsAction, ColorsReducer } from '../reducers/colors'

interface ContrastCalculatorProps {
  colors: ColorsReducer
  colorsDispatch: React.Dispatch<ColorsAction>
  setModalContrast: React.Dispatch<React.SetStateAction<boolean>>
}

export const ContrastCalculator = ({ colors, colorsDispatch, setModalContrast }: ContrastCalculatorProps) => {
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false)

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
    const colorRgb = hexToRgb(colors.primary.color)
    const secondaryRgb = hexToRgb(colors.secondary.color)
    const contrast = rateContrast([colorRgb, secondaryRgb ])

    setContrast(contrast)
  }, [colors.secondary, colors.primary])

  function handleColorPicker(newColor: string) {
    setOpenColorPicker(!openColorPicker)
    setUpdatedColor(newColor)
  }

  return (
    <>
      <Modal setModal={setModalContrast} backgroundOpacity={0.4}>
        <div className='Contrast-Calculator'
          style={{
            alignSelf: openColorPicker ? 'start' : 'center',
            marginTop: openColorPicker ? '80px' : 0
          }}
        >
          <div className='buttons-container'>
            <button
              className='color-button color-button--primary'
              style={{
                backgroundColor: colors.primary.color,
                color: colors.primary.contrastColor === '#000000' ? '#1A1B25' :   '#fff',
                border: colors.primary.color === '#1a1b25' ? '1px solid rgba(200, 200, 200, 0.3)' : 'none'
              }}
              onClick={() => handleColorPicker('primary')}
            >
              {colors.primary.color}
            </button>

            <div
              className='color-button color-button--secondary'
              style={{
                backgroundColor: colors.secondary.color,
                border: colors.secondary.color === '#1a1b25' ? '1px solid rgba(200, 200, 200, 0.3)' : 'none'
              }}
              >
              <button
                className='secondary-color'
                onClick={() => handleColorPicker('secondary')}
                style={{
                  color: colors.secondary.contrastColor  === '#000000' ? '#1A1B25' :   '#fff',
                }}
              >
              {colors.secondary.color}
              </button>

              <button
                className='secondary-add'
                onClick={() => colorsDispatch({ type: 'add-color', payload: { color: colors.primary.color, newColor: colors.secondary.color, side: 'right' } })}
                style={{
                  color: colors.secondary.contrastColor  === '#000000' ? '#1A1B25' :   '#fff',
                }}
              >
                <span className='icon-plus'></span>
              </button>
            </div>
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
            color={updatedColor === 'primary' ? colors.primary : colors.secondary}
            colorsDispatch={colorsDispatch}
            type={updatedColor === 'primary' ? 'update-primary' : 'secondary'}
          />
      }
    </>
  )
}