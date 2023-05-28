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
import { Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from '../lib/types'
import { colorFormatConverter } from '../lib'
import { ColorPicker } from '../components/colorPicker/ColorPicker'
import colorBlind from '../lib/colorBlind'
import { Header } from '../components/Header'
import { OptionsBar } from '../components/OptionsBar'

export interface Color {
  color: string
  isLocked: boolean
  contrastColor: string
  id: number
  formats: Formats
  colorBlind: ColorBlindSimulator
}

export interface ColorBlindSimulator {
  achromatomaly: string
  achromatopsia: string
  deuteranomaly: string
  deuteranopia: string
  protanomaly: string
  protanopia: string
  tritanomaly: string
  tritanopia: string
}

interface Formats {
  cmyk: Cmyk
  hsb: Hsv
  hsl: Hsl
  lab: Lab
  rgb: Rgb
  xyz: Xyz
}

const colorBlindOptions = [
  'achromatomaly',
  'achromatopsia',
  'deuteranomaly',
  'deuteranopia',
  'protanomaly',
  'protanopia',
  'tritanomaly',
  'tritanopia',
  'none'
]

export const PaletteGenerator = () => {
  const [colors, setColors] = useState<Color[]>([])
  const [modalContrast, setModalContrast] = useState<boolean>(false)
  const [modalPicker, setModalPicker] = useState<boolean>(false)
  const [openColorBlind, setOpenColorBlind] = useState(false)
  const [currentColorBlind, setCurrentColorBlind] = useState('none')
  const [currentColor, setCurrentColor] = useState<Color>({
    color: '',
    isLocked: false,
    contrastColor: '',
    id: 0,
    formats: {
      cmyk: { c: 0, m: 0, y: 0, k:0 },
      hsb: { h: 0, s: 0, v: 0 },
      hsl: { h: 0, s: 0, l: 0 },
      lab: { l: 0, a: 0, b: 0 },
      rgb: { r: 0, g: 0, b: 0 },
      xyz: { x: 0, y: 0, z: 0 }
    },
    colorBlind: {
      achromatomaly: '',
      achromatopsia: '',
      deuteranomaly: '',
      deuteranopia: '',
      protanomaly: '',
      protanopia: '',
      tritanomaly: '',
      tritanopia: '',
    }
  })

  useEffect(() => {
    changeColorPalette(true)
  }, [])

  useKeyDown(() => {
    changeColorPalette(false)
  }, ['Space'])

  // Update color
  useEffect(() => {
    const newColor = colors.findIndex(color => color.color === currentColor.color)
    
    if (currentColor.color !== '' && newColor == -1 && colors.length !== 0) {
      const updatedColors = colors.map((clr) => {
        
        if (clr.id === currentColor.id) {
          return {
            color: currentColor.color,
            isLocked: clr.isLocked,
            contrastColor: getMainContrastColor(currentColor.color),
            id: clr.id,
            formats: currentColor.formats,
            colorBlind: currentColor.colorBlind
          }
        }
        return clr
      })
      setColors(updatedColors)
    }
  }, [currentColor])

  function changeColorPalette(firstRender: boolean) {
    const newColors = makeColorPalette({
      randomColor: true,
      format: "hex",
      paletteType: 'analogous',
      quantity: firstRender ? 5 : colors.length
    }) as string[]

    const newObject = newColors.map((color): Color => {
      return createNewColor(color)
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

  function createNewColor(color: string): Color {
    const formats = colorFormatConverter(color, {
      currentFormat: 'hex',
      AllFormats: true,
    })

    return {
      color: color,
      isLocked: false,
      contrastColor: getMainContrastColor(color),
      id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
      formats: {
        cmyk: formats.cmyk as Cmyk,
        hsb: formats.hsv as Hsv,
        hsl: formats.hsl as Hsl,
        lab: formats.lab as Lab,
        rgb: formats.rgb as Rgb,
        xyz: formats.xyz as Xyz,
      },
      colorBlind: {
        achromatomaly: colorBlind.toAchromatomaly(color) as string,
        achromatopsia: colorBlind.toAchromatopsia(color) as string,
        deuteranomaly: colorBlind.toDeuteranomaly(color) as string,
        deuteranopia: colorBlind.toDeuteranopia(color) as string,
        protanomaly: colorBlind.toProtanomaly(color) as string,
        protanopia: colorBlind.toProtanopia(color) as string,
        tritanomaly: colorBlind.toTritanomaly(color) as string,
        tritanopia: colorBlind.toTritanopia(color) as string
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event
    const dragged = active.id as string
    const target = over?.id as string

    if(dragged !== target) {
      setColors((colores) => {
        const activeIndex = colores.findIndex(item  => item.id === +dragged)
        const overIndex = colores.findIndex(item  => item.id === +target)
        return arrayMove(colores, activeIndex, overIndex)
      })
    }
  }

  function addColor(existingColor: string, newColor: string, side: string) {
    const mainColorIndex = colors.findIndex(clr => clr.color === existingColor)

    const newObjectColor = createNewColor(newColor)
    const newColorIndex = side === 'right' ? mainColorIndex + 1 : mainColorIndex
    
    const newColors = Array.from(colors)
    newColors.splice(newColorIndex, 0, newObjectColor)

    setColors(newColors)
  }

  return (
    <>
      <Header
        setOpenColorBlind={setOpenColorBlind}
      />

      {openColorBlind &&
        <OptionsBar
          options={colorBlindOptions}
          currentOption={currentColorBlind}
          setCurrentOption={setCurrentColorBlind}
          setOpen={setOpenColorBlind}
        />
      }

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
                setModalPicker={setModalPicker}
                setCurrentColor={setCurrentColor}
                addColor={addColor}
                currentColorBlind={currentColorBlind}
              />
            ))} 
          </SortableContext>
          { modalContrast &&
            <ContrastCalculator
              color={currentColor}
              setColor={setCurrentColor}
              setModalContrast={setModalContrast}
              addColor={addColor}
            />
          }
          {
            modalPicker && 
            <ColorPicker
            setModalColorPicker={setModalPicker}
            color={currentColor}
            setColor={setCurrentColor}
            />
          }
        </main>
      </DndContext>
    </>
  )
}