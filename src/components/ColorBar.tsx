import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Rgb, rgbToHex } from 'colors-kit'

import { Color, ColorBlindSimulator } from '../pages/PaletteGenerator'

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
}

export const ColorBar = ({ color, colors, currentColorBlind, heightColorBlind, handleStartResize, resizeColorBlind, colorsDispatch, setUpdatedColor, modalsDispatch, setTooltipMessage }: ColorBarProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: color.id })

  const [cliked, setCliked] = useState<boolean>(false)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [hoverSide, setHoverSide] = useState<string>('none')

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

    colorsDispatch({ type: 'add-color', payload: { color, newColor, side } })
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
        zIndex: cliked || isHovering ? 1 : 0,
        color: color.contrastColor,
        height: `calc(100% - ${heightColorBlind})`
      }}
      onFocus={() => setIsHovering(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
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

      {isHovering && !resizeColorBlind &&
        <>
          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={() => handleRemoveColor(color.id)}
          >
            <span className='icon-x' />
          </button>

          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={handleCopyToClipboard}
          >
            <span className='icon-clipboard' />
          </button>

          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={handleLockColor}
          >
            {color.isLocked
              ? <span className='icon-lock-close' />
              : <span className='icon-lock-open' />
            }
          </button>

          <button
            className='color-button'
            style={{
            'color': color.contrastColor
            }}
            onMouseDown={() => setCliked(true)}
            onMouseUp={() => setCliked(false)}
            {...listeners}
          >
            <span className='icon-move' />
          </button>

          <button
            className='color-button'
            style={{
            'color': color.contrastColor
            }}
            onMouseDown={handleContrast}
          >
            <span className='icon-contrast' />
          </button>

          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={handleOpenPicker}
          >
            <span className='icon-eye-dropper' />
          </button>
        </>
      }
    </div>
  )
}