import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import '../styles/ColorBar.css'
import { Color } from '../pages/PaletteGenerator'

interface ColorBarProps {
  color: Color
  colors: Color[]
  setColors: React.Dispatch<React.SetStateAction<Color[]>>
  setModalContrast: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentColor: React.Dispatch<React.SetStateAction<Color>>
}

export const ColorBar = ({ color, colors, setColors, setModalContrast, setCurrentColor }: ColorBarProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: color.id })

  const [cliked, setCliked] = useState<boolean>(false)
  const [isHovering, setIsHovering] = useState<boolean>(false)

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
          formats: clr.formats
        }
      }
      return clr
    })
    setColors(newColors)
  }

  const buttonColor = {
    'color': color.contrastColor
  }

  function handleContrast() {
    setModalContrast(modal => !modal)
    setCurrentColor(color)
  }

  return (
    <div
      className='Color-Bar'
      ref={setNodeRef}
      {...attributes}
      style={{
        ...style,
        'background': color.color,
        'zIndex': cliked ? 1 : 0,
        'color': color.contrastColor
      }}
      onMouseEnter={() => setIsHovering(!isHovering)}
      onMouseLeave={() => setIsHovering(!isHovering)}
    >
      {color.color}
      {isHovering &&
        <>
          <button
            className='color-button'
            style={buttonColor}
            onMouseDown={() => handleLockColor(color.color)}
          >
            {color.isLocked
              ? <span className='icon-lock-close'></span>
              : <span className='icon-lock-open'></span>
            }
          </button>

          <button
            className='color-button'
            style={buttonColor}
            onMouseDown={() => { setCliked(true) }}
            onMouseUp={() => { setCliked(false) }}
            {...listeners}
          >
            <span className='icon-move'></span>
          </button>

          <button
            className='color-button'
            style={buttonColor}
            onMouseDown={() => handleContrast()}
          >
            <span className='icon-contrast'></span>
          </button>
        </>
      }
    </div>
  )
}