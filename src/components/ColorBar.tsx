import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface ColorBarProps {
  id: string
}

const ColorBar = ({ id }: ColorBarProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: id})

  const [cliked, setCliked] = useState(false)

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    // transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  }: undefined  

  return (
    <div
      onMouseDown={() => { setCliked(true) }}
      onMouseUp={() => { setCliked(false) }}
      ref={setNodeRef}
      style={{
        ...style,
        'background': id,
        'width': '100%',
        'flex': 1,
        'height': '100vh',
        'zIndex': cliked ? 1 : 0
      }}
      {...attributes}
      {...listeners}
    >
      {id}
      {/* <button onClick={() => handleLock(id)}>Lock</button> */}
    </div>
  )
}

export default ColorBar