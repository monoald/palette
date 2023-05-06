import React, { useEffect } from 'react'
import { useState } from 'react'
import { makeColorPalette } from '../lib/palette'
import { useKeyDown } from '../hooks/useKeyDown'
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { ColorBar } from '../components/ColorBar'
import '../styles/PaletteGenerator.css'
import '../assets/icons/style.css'

interface Color {
  id: string
  isLocked: boolean
}

export const PaletteGenerator = () => {
  const [colors, setColors] = useState<Color[]>([])

  function changeColorPalette() {
    const newColors = makeColorPalette({
      randomColor: true,
      format: "hex",
      paletteType: 'analogous',
      quantity: 5
    }) as string[]

    const newObject = newColors.map(color => {
      return { id: color, isLocked: false }
    })
    const lockedIndex: number[] = []

    colors.forEach((color, index) => {
      if (color.isLocked === true) lockedIndex.push(index)
    })

    lockedIndex.forEach(color => {
      newObject.splice(color, 1, colors[color])
    })

    setColors(newObject)
  }

  useEffect(() => {
    changeColorPalette()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const activeIndex = colores.findIndex(item  => item.id === dragged)
        const overIndex = colores.findIndex(item  => item.id === target)

        return arrayMove(colores, activeIndex, overIndex)
      })
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <main className='Palette-Generator'>
        <SortableContext
          items={colors}
          strategy={horizontalListSortingStrategy}
        >
          {colors.map((color: Color) => (
            <ColorBar color={color} colors={colors} setColors={setColors} />
          ))}
        </SortableContext>
      </main>
    </DndContext>
  )
}