import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Rgb, rgbToHex } from 'colors-kit'

import { Color, ColorBlindSimulator } from '../pages/PaletteGenerator'
import { DescriptionTooltip } from './tooltips/DescriptionTooltip'

import { ColorsAction } from '../reducers/colors'
import { ModalsAction } from '../reducers/modals'

import '../styles/ColorBar.css'
import { useCheckSavedColor } from '../hooks/useCheckSavedColor'

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
}

export const ColorBar = ({ color, colors, currentColorBlind, heightColorBlind, handleStartResize, resizeColorBlind, colorsDispatch, setUpdatedColor, modalsDispatch, setTooltipMessage }: ColorBarProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: color.id })

  const [hoverSide, setHoverSide] = useState<string>('none')

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

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLElement
    const { offsetX } = event.nativeEvent
    const triggerWidth = 60

    if (target.className === 'Color-Bar') {
      if (offsetX < triggerWidth) {
        setHoverSide('left')
      } else if (offsetX > (target.clientWidth - triggerWidth)) {
        setHoverSide('right')
      } else {
        setHoverSide('none')
      }
    }
  }

  function combineColors(color1: Rgb, color2: Rgb) {
    const combinedColor = {
      r: Math.round((color1.r + color2.r) / 2),
      g: Math.round((color1.g + color2.g) / 2),
      b: Math.round((color1.b + color2.b) / 2),
    }

    return combinedColor
  }

  function handleAddColor(color: string, side: string) {
    const mainColorIndex = colors.findIndex(clr => clr.color === color)
    const secondaryColorIndex = side === 'left' ? mainColorIndex - 1 : mainColorIndex + 1
    
    const color1 = colors[mainColorIndex].formats.rgb
    const color2 = colors[secondaryColorIndex].formats.rgb
    
    const newColorRgb = combineColors(color1, color2)
    const newColor = rgbToHex(newColorRgb)

    colorsDispatch({ type: 'add-color', payload: { color, addedColor: newColor, side } })
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
      onMouseLeave={() => {
        setHoverSide('none')
      }}
      onMouseMove={handleMouseMove}
    >
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
      <button
        className='new-color-button'
        style={{
          left: hoverSide === 'left' ? '-25px' : 'calc(100% - 25px)',
          display: hoverSide === 'none' ? 'none' : 'flex',
        }}
        onClick={() => handleAddColor(color.color, hoverSide)}
      >
        <span className='icon-plus' />
      </button>

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
            // onMouseDown={saveHandler}
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