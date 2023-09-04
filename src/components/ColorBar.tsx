import React from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Rgb, rgbToHex } from 'colors-kit'

import { useCheckSavedColor } from '../hooks/useCheckSavedColor'

import { Color, ColorBlindSimulator } from '../pages/PaletteGenerator'
import { DescriptionTooltip } from './tooltips/DescriptionTooltip'

import { ColorsAction } from '../reducers/colors'
import { ModalsAction } from '../reducers/modals'

import '../styles/ColorBar.css'

interface ColorBarProps {
  color: Color
  colors: Color[]
  currentColorBlind: string
  heightColorBlind: number
  handleStartResize: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  resizeColorBlind: boolean
  colorsDispatch: React.Dispatch<ColorsAction>
  setUpdatedColor: React.Dispatch<React.SetStateAction<string>>
  modalsDispatch: React.Dispatch<ModalsAction>
  setTooltipMessage: React.Dispatch<React.SetStateAction<string>>
  index: number
}

export const ColorBar = ({
  color,
  colors,
  currentColorBlind,
  heightColorBlind,
  handleStartResize,
  resizeColorBlind,
  colorsDispatch,
  setUpdatedColor,
  modalsDispatch,
  setTooltipMessage,
  index
}: ColorBarProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: color.id })

  const [isSaved, savedId] = useCheckSavedColor(color.color)
  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  }: undefined 
  
  function handleLockColor() {
    colorsDispatch({ type: 'lock-color', payload: { color: color.color } })
  }

  function handleContrast() {
    modalsDispatch({ type: 'contrast' })
    colorsDispatch({ type: 'set-primary', payload: { colorObject: color } })
    colorsDispatch({ type: 'secondary', payload: { color: color.contrastColor, format: 'hex' } })
  }

  function combineColors(color1: Rgb, color2: Rgb) {
    const combinedColor = {
      r: Math.round((color1.r + color2.r) / 2),
      g: Math.round((color1.g + color2.g) / 2),
      b: Math.round((color1.b + color2.b) / 2),
    }

    return combinedColor
  }

  function handleAddColor(color: string) {
    const secondaryColorIndex = index + 1
    
    const color1 = colors[index].formats.rgb
    const color2 = colors[secondaryColorIndex].formats.rgb
    
    const newColorRgb = combineColors(color1, color2)
    const newColor = rgbToHex(newColorRgb)

    colorsDispatch({ type: 'add-color', payload: { color, addedColor: newColor, side: 'right' } })
  }

  function handleRemoveColor(id: number) {
    colorsDispatch({ type: 'remove-color', payload: { id } })
  }

  function handleOpenPicker() {
    colorsDispatch({ type: 'set-primary', payload: { colorObject: color } })
    modalsDispatch({ type: 'picker' })
    setUpdatedColor('primary')
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(color.color)
    setTooltipMessage('Copied!')
  }

  return (
    <div
      className='Color-Bar'
      ref={setNodeRef}
      {...attributes}
      style={{
        ...style,
        background: color.color,
        color: color.contrastColor,
        height: `calc(100% - ${heightColorBlind})`
      }}
    >
      { index + 1 !== colors.length &&
        <div className='add-new-container'>
          <button
            className='new-color-button'
            onClick={() => handleAddColor(color.color)}
          >
            <span className='icon-plus' />
          </button>
        </div>
      }

      <div className='color-blind-container'
        style={{
          width: '100%',
          height: currentColorBlind === 'none' ? '0' : heightColorBlind,
          display: currentColorBlind === 'none' ? 'none' : 'block',
          background: color.colorBlind[currentColorBlind as keyof ColorBlindSimulator],
        }}
        onMouseDown={handleStartResize}
        data-tooltip
      >
      </div>

      <p className='color-hex'>
        {color.color}
      </p>

      { !resizeColorBlind &&
        <>
          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={() => handleRemoveColor(color.id)}
            data-tooltip
          >
            <span className='icon-x' />
            <DescriptionTooltip text='Remove' tipPosition='bottom' />
          </button>

          <button
            className='color-button color-like'
            style={{
              'color': color.contrastColor
            }}
            data-tooltip
            data-name={color.color.substring(1)}
            data-saved={isSaved}
            data-id={savedId}
          >
            <span
              className={`
                icon
                icon-heart${isSaved ? '-filled' : ''}
              `}
            />
            <DescriptionTooltip text='Add to clip-board' tipPosition='bottom' />
          </button>

          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={handleCopyToClipboard}
            data-tooltip
          >
            <span className='icon-clipboard' />
            <DescriptionTooltip text='Add to clip-board' tipPosition='bottom' />
          </button>

          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={handleLockColor}
            data-tooltip
          >
            {color.isLocked
              ? <span className='icon-lock-close' />
              : <span className='icon-lock-open' />
            }
            <DescriptionTooltip text={color.isLocked ? 'Unlock' : 'Lock'} tipPosition='bottom' />
          </button>

          <button
            className='color-button'
            style={{
            'color': color.contrastColor
            }}
            data-tooltip
            {...listeners}
          >
            <span className='icon-move' />
            <DescriptionTooltip text='Move' tipPosition='bottom' />
          </button>

          <button
            className='color-button'
            style={{
            'color': color.contrastColor
            }}
            onMouseDown={handleContrast}
            data-tooltip
          >
            <span className='icon-contrast' />
            <DescriptionTooltip text='Contrast calculator' tipPosition='bottom' />
          </button>

          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={handleOpenPicker}
            data-tooltip
          >
            <span className='icon-eye-dropper' />
            <DescriptionTooltip text='Color picker' tipPosition='bottom' />
          </button>
        </>
      }
    </div>
  )
}