import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import '../styles/ColorBar.css'

interface Color {
  id: string
  isLocked: boolean
}
interface ColorBarProps {
  color: Color
  colors: Color[]
  setColors: React.Dispatch<React.SetStateAction<Color[]>>
}

export const ColorBar = ({ color, colors, setColors }: ColorBarProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: color.id })

  const [cliked, setCliked] = useState<boolean>(false)

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  }: undefined 
  
  function handleLockColor(item: string) {

    const newColors = colors.map((clr) => {
      if (clr.id === item) {
        return { id: clr.id, isLocked: !clr.isLocked }
      }
      return clr
    })
    setColors(newColors)
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        'background': color.id,
        'zIndex': cliked ? 1 : 0
      }}
      className='Color-Bar'
      {...attributes}
    >
      {color.id}
      <button
        className='color-button'
        onMouseDown={() => handleLockColor(color.id)}
      >
        {color.isLocked
          ? <span className='icon-lock-close'></span>
          : <span className='icon-lock-open'></span>
        }
      </button>

      <button
        className='color-button'
        onMouseDown={() => { setCliked(true) }}
        onMouseUp={() => { setCliked(false) }}
        {...listeners}
      >
        <span className='icon-move'></span>
      </button>
    </div>
  )
}