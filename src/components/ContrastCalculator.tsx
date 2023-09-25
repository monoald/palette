import React, { useEffect, useState } from 'react'
import { WCAGRequierements, rateContrast, hexToRgb } from 'colors-kit'

import { ContrastTable } from './ContrastTable'
import { DraggableModal } from '../containers/DraggableModal'

import { ColorsAction, ColorsReducer } from '../reducers/colors'
import { ModalsAction } from '../reducers/modals'
import '../styles/ContrastCalculator.css'
import { DescriptionTooltip } from './tooltips/DescriptionTooltip'

interface ContrastCalculatorProps {
  colors: ColorsReducer
  colorsDispatch: React.Dispatch<ColorsAction>
  setUpdatedColor: React.Dispatch<React.SetStateAction<string>>
  modalsDispatch: React.Dispatch<ModalsAction>
}

export const ContrastCalculator = ({ colors, colorsDispatch, setUpdatedColor, modalsDispatch }: ContrastCalculatorProps) => {
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
    modalsDispatch({ type: 'picker' })
    setUpdatedColor(newColor)
  }

  return (
    <DraggableModal nameClass="Contrast-Calculator">
      <div className='buttons-container'>
        <button
          className='color-button color-button--primary'
          style={{
            backgroundColor: colors.primary.color,
            color: colors.primary.contrastColor === '#000000' ? 'var(--main)' :   'var(--color-txt-main)',
            border: colors.primary.color === 'var(--main)' ? '1px solid var(--txt-inactive)' : 'none'
          }}
          onClick={() => handleColorPicker('primary')}
        >
          {colors.primary.color}
        </button>

        <div
          className='color-button color-button--secondary'
          style={{
            backgroundColor: colors.secondary.color,
            border: colors.secondary.color === 'var(--main)' ? '1px solid var(--txt-inactive)' : 'none'
          }}
          >
          <button
            className='secondary-color'
            onClick={() => handleColorPicker('secondary')}
            style={{
              color: colors.secondary.contrastColor  === '#000000' ? 'var(--main)' :   'var(--color-txt-main)',
            }}
          >
          {colors.secondary.color}
          </button>

          <button
            className='secondary-add'
            onClick={() => colorsDispatch({ type: 'add-color', payload: { color: colors.primary.color, addedColor: colors.secondary.color, side: 'right' } })}
            style={{
              color: colors.secondary.contrastColor  === '#000000' ? 'var(--main)' :   'var(--color-txt-main)',
            }}
          >
            <span className='icon-plus'></span>
          </button>
        </div>
      </div>

      <div className='wcag-info'>
        <div className='wcag-info__container txt-hover-primary' data-tooltip>
          <p>
            {contrast.contrastValue}:1
          </p>
          <span className='wcag-info__icon icon-info' />
          <DescriptionTooltip
            text='Web Content Accessibility Guidelines contrast rate'
            tipPosition='bottom'
          />
        </div>
        <ContrastTable contrast={contrast} />
      </div>

      <button
        className='secondary-button'
        onClick={() => modalsDispatch({ type: 'contrast' })}
      >
        Close
      </button>
    </DraggableModal>
  )
}