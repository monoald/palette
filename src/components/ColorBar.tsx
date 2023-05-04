import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface ColorBarProps {
  color: string
  setLockedColors: React.Dispatch<React.SetStateAction<string[]>>
}

const ColorBar = ({ color, setLockedColors }: ColorBarProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: color})

  const [cliked, setCliked] = useState(false)

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  }: undefined 
  
  function handleLockColor(item: string) {
    setLockedColors((lockedColors) => {
      if (lockedColors.includes(item)) {
        return lockedColors
      } else {
        return [...lockedColors, item]
      }
  })
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        'background': color,
        'width': '100%',
        'flex': 1,
        'height': '100vh',
        'zIndex': cliked ? 1 : 0
      }}
      {...attributes}
    >
      {color}
      <button onClick={() => handleLockColor(color)}>Lock</button>

      <button
        onMouseDown={() => { setCliked(true) }}
        onMouseUp={() => { setCliked(false) }}
        {...listeners}
      >
        Move
      </button>
    </div>
  )
}

export default ColorBar