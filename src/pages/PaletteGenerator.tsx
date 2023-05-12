import React, { useEffect, useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { hexToRgb } from '../lib'
import { makeColorPalette } from '../lib/palette'
import { rateContrast } from '../lib/rate/rateContrast'
import { useKeyDown } from '../hooks/useKeyDown'
import { ColorBar } from '../components/ColorBar'
import { ContrastCalculator } from '../components/ContrastCalculator'
import '../assets/icons/style.css'
import '../styles/PaletteGenerator.css'

interface Color {
  id: string
  isLocked: boolean
  contrastColor: string
}

interface ContrastColor {
  color: string
  primaryColorContrast: string
}

export const PaletteGenerator = () => {
  const [colors, setColors] = useState<Color[]>([])
  const [modalContrast, setModalContrast] = useState<boolean>(false)
  const [currentColor, setCurrentColor] = useState<ContrastColor>({
    color: '',
    primaryColorContrast: ''
  })

  function changeColorPalette() {
    const newColors = makeColorPalette({
      randomColor: true,
      format: "hex",
      paletteType: 'monochromatic',
      quantity: 5
    }) as string[]

    const newObject = newColors.map(color => {
      const rgb = hexToRgb(color)

      const whiteContrast = rateContrast([{ r: 255, g: 255, b: 255}, rgb ])
      const blackContrast = rateContrast([{ r: 0, g: 0, b: 0}, rgb ])
      return {
        id: color,
        isLocked: false,
        contrastColor: whiteContrast.contrastValue > blackContrast.contrastValue ? '#ffffff' : '#000000'
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
            setModalContrast={setModalContrast}
          />
        }
      </main>
    </DndContext>
  )
}