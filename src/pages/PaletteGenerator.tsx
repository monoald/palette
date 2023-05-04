import React, { useEffect } from 'react'
import { useState } from 'react'
import { makeColorPalette } from '../lib/palette'
import { useKeyDown } from '../hooks/useKeyDown'
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { ColorBar } from '../components/ColorBar'
import '../styles/PaletteGenerator.css'

export const PaletteGenerator = () => {
  const [colors, setColors] = useState<string[]>([])
  const [lockedColors, setLockedColors] = useState<string[]>([])
  console.log(colors);
  

  function changeColorPalette() {
    const newColors = makeColorPalette({
      randomColor: true,
      format: "hex",
      paletteType: 'analogous',
      quantity: 5
    }) as string[]

    if (lockedColors.length !== 0) {
      const lockedColorsIndex = lockedColors.map((color) => {
        return colors.indexOf(color)
      })
      
      lockedColorsIndex.forEach(color => {
        newColors.splice(color, 1, colors[color])
      })
    }

    setColors(newColors)
  }

  useEffect(() => {
    const newColors = makeColorPalette({
      randomColor: true,
      format: "hex",
      paletteType: 'analogous',
      quantity: 5
    }) as string[]

    setColors(newColors)
  }, [])
  
  
  useKeyDown(() => {
    changeColorPalette()
  }, ['Space'])

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event
    const dragged = active.id as string
    const target = over?.id as string

    if(dragged !== target) {
      setColors((colores) => {
        const activeIndex = colores.indexOf(dragged)
        const overIndex = colores.indexOf(target)

        return arrayMove(colores, activeIndex, overIndex)
      })
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div style={{'display': 'flex', height: '100vh'}}>
        <SortableContext
          items={colors}
          strategy={horizontalListSortingStrategy}
        >
          {colors.map((color: string) => (
            <ColorBar color={color} setLockedColors={setLockedColors} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}