/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { makeColorPalette } from '../lib/palette'
import { useKeyDown } from '../hooks/useKeyDown'
import { ColorBar } from '../components/ColorBar'
import { ContrastCalculator } from '../components/ContrastCalculator'
import '../assets/icons/style.css'
import '../styles/PaletteGenerator.css'
import { getMainContrastColor } from '../utils/getMainContrastColor'

interface Color {
  color: string
  isLocked: boolean
  contrastColor: string
  id: number
}

interface ContrastColor {
  color: string
  primaryColorContrast: string
  id: number
}

export const PaletteGenerator = () => {
  const [colors, setColors] = useState<Color[]>([])
  const [modalContrast, setModalContrast] = useState<boolean>(false)
  const [currentColor, setCurrentColor] = useState<ContrastColor>({
    color: '',
    primaryColorContrast: '',
    id: 0
  })

  function changeColorPalette() {
    const newColors = makeColorPalette({
      randomColor: true,
      format: "hex",
      paletteType: 'monochromatic',
      quantity: 5
    }) as string[]

    const newObject = newColors.map((color, index) => {
      return {
        color: color,
        isLocked: false,
        contrastColor: getMainContrastColor(color),
        id: index
      }
    })

    // Keep locked colors
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
  }, [])

  useKeyDown(() => {
    changeColorPalette()
  }, ['Space'])

  useEffect(() => {
    const newColor = colors.findIndex(color => color.color === currentColor.color)
    
    if (currentColor !== null && newColor == -1 && colors.length !== 0) {
      const updatedColors = colors.map((clr) => {
        if (clr.id === currentColor.id) {
          return {
            color: currentColor.color,
            isLocked: clr.isLocked,
            contrastColor: getMainContrastColor(currentColor.color),
            id: clr.id
          }
        }
        return clr
      })
      setColors(updatedColors)
    }
  }, [currentColor])
  

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event
    const dragged = active.id as string
    const target = over?.id as string

    if(dragged !== target) {
      setColors((colores) => {
        const activeIndex = colores.findIndex(item  => item.color === dragged)
        const overIndex = colores.findIndex(item  => item.color === target)

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
            <ColorBar
              color={color}
              colors={colors}
              setColors={setColors}
              setModalContrast={setModalContrast}
              setCurrentColor={setCurrentColor}
            />
          ))}
        </SortableContext>
        { modalContrast &&
          <ContrastCalculator
            color={currentColor}
            setColor={setCurrentColor}
            setModalContrast={setModalContrast}
            colorsLength={colors.length}
          />
        }
      </main>
    </DndContext>
  )
}