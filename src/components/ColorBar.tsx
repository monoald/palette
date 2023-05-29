import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import '../styles/ColorBar.css'
import { Color, ColorBlindSimulator } from '../pages/PaletteGenerator'
import { Rgb } from '../lib/types'
import { rgbToHex } from '../lib'

interface ColorBarProps {
  color: Color
  colors: Color[]
  setColors: React.Dispatch<React.SetStateAction<Color[]>>
  setModalContrast: React.Dispatch<React.SetStateAction<boolean>>
  setModalPicker: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentColor: React.Dispatch<React.SetStateAction<Color>>
  addColor: (existingColor: string, newColor: string, side: string) => void
  currentColorBlind: string
  heightColorBlind: number
  handleStartResize: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  resizeColorBlind: boolean
}

export const ColorBar = ({ color, colors, setColors, setModalContrast, setModalPicker, setCurrentColor, addColor, currentColorBlind, heightColorBlind, handleStartResize, resizeColorBlind }: ColorBarProps) => {
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
  
  function handleLockColor(item: string) {

    const newColors = colors.map((clr): Color => {
      if (clr.color === item) {
        return {
          color: clr.color,
          isLocked: !clr.isLocked,
          contrastColor: clr.contrastColor,
          id: clr.id,
          formats: clr.formats,
          colorBlind: clr.colorBlind
        }
      }
      return clr
    })
    setColors(newColors)
  }

  function handleContrast() {
    setModalContrast(modal => !modal)
    setCurrentColor(color)
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLElement
    const { offsetX } = event.nativeEvent;
    const triggerWidth = 20

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
    };

    return combinedColor;
  }

  function handleAddColor(color: string, side: string) {
      const mainColorIndex = colors.findIndex(clr => clr.color === color)
      const secondaryColorIndex = side === 'left' ? mainColorIndex - 1 : mainColorIndex + 1
      
      const color1 = colors[mainColorIndex].formats.rgb
      const color2 = colors[secondaryColorIndex].formats.rgb
      
      const newColorRgb = combineColors(color1, color2)
      const newColorHex = rgbToHex(newColorRgb)

      addColor(color, newColorHex, side)
    }

  function handleRemoveColor(id: number) {
    const newColors = Array.from(colors)

    const colorIndex = newColors.findIndex(color => color.id === id)
    newColors.splice(colorIndex, 1)

    setColors(newColors)
  }

  function handleOpenPicker() {
    setCurrentColor(color)
    setModalPicker(modal => !modal)
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
          height: currentColorBlind === 'none'? '0' : heightColorBlind,
          background: color.colorBlind[currentColorBlind as keyof ColorBlindSimulator]
        }}
        onMouseDown={handleStartResize}
      >
      </div>

      {color.color}
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
            onMouseDown={() => handleLockColor(color.color)}
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
            onMouseDown={() => { setCliked(true) }}
            onMouseUp={() => { setCliked(false) }}
            {...listeners}
          >
            <span className='icon-move' />
          </button>

          <button
            className='color-button'
            style={{
            'color': color.contrastColor
            }}
            onMouseDown={() => handleContrast()}
          >
            <span className='icon-contrast' />
          </button>

          <button
            className='color-button'
            style={{
              'color': color.contrastColor
            }}
            onMouseDown={() => handleOpenPicker()}
          >
            <span className='icon-eye-dropper' />
          </button>
        </>
      }
    </div>
  )
}