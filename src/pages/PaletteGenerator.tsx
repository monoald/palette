/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { PaletteType, makeColorPalette } from '../lib/palette'
import { useKeyDown } from '../hooks/useKeyDown'
import { ColorBar } from '../components/ColorBar'
import { ContrastCalculator } from '../components/ContrastCalculator'
import '../assets/icons/style.css'
import '../styles/PaletteGenerator.css'
import { getMainContrastColor } from '../utils/getMainContrastColor'
import { Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from '../lib/types'
import { ColorPicker } from '../components/colorPicker/ColorPicker'
import { Header } from '../components/Header'
import { ImageColorExtractor } from '../components/ImageColorExtractor'
import { createNewColor } from '../utils/createNewColor'
import OptionBarContainer from '../containers/OptionBarContainer'
import { initialState, optionsReducer } from '../reducers/options'

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

export const PaletteGenerator = () => {
  const [options, optionsDispatch] = useReducer(optionsReducer, initialState)
  const [colors, setColors] = useState<Color[]>([])
  const [modalContrast, setModalContrast] = useState<boolean>(false)
  const [modalPicker, setModalPicker] = useState<boolean>(false)
  const [heightColorBlind, setHeightColorBlind] = useState(0)
  const [resizeColorBlind, setResizeColorBlind] = useState(false)
  const [modalImageExtractor, setModalImageExtractor] = useState(false)
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

  const mainRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    changeColorPalette(true)
  }, [])

  useKeyDown(() => {
    changeColorPalette(false)
  }, ['Space'])

  useEffect(() => {
    if (options.colorBlind !== 'none' && heightColorBlind === 0) {
      // if (currentColorBlind !== 'none' && heightColorBlind === 0) {
      setHeightColorBlind(280)
    } 
  }, [options.colorBlind])
  // }, [currentColorBlind])

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
      paletteType: options.paletteType as PaletteType,
      // paletteType: paletteType as PaletteType,
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

  function handleStartResize(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLElement
    const clientHeight = target.getBoundingClientRect().height
    const clientTop = target.getBoundingClientRect().top
    const mouseY = event.clientY - clientTop
    if(clientHeight - mouseY <= 8) {
      setResizeColorBlind(true)
    }
  }

  function handleResize(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (resizeColorBlind) {
      const target = mainRef.current as HTMLElement
      const clientTop = target.getBoundingClientRect().top
      const mouseY = event.clientY - clientTop
      setHeightColorBlind(mouseY)
    }
  }

  function handleEndResize() {
    setResizeColorBlind(false)
  }

  return (
    <>
      <Header
        optionsDispatch={optionsDispatch}
        setImageExtractor={setModalImageExtractor}
      />

      <OptionBarContainer
        options={options}
        optionsDispatch={optionsDispatch}
      />

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <main
          className='Palette-Generator'
          ref={mainRef}
          onMouseMove={handleResize}
          onMouseUp={handleEndResize}
        >
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
                currentColorBlind={options.colorBlind}
                heightColorBlind={heightColorBlind}
                handleStartResize={handleStartResize}
                resizeColorBlind={resizeColorBlind}
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
          { modalPicker && 
            <ColorPicker
            setModalColorPicker={setModalPicker}
            color={currentColor}
            setColor={setCurrentColor}
            />
          }
          { modalImageExtractor &&
            <ImageColorExtractor
              setModaImageExtractor={setModalImageExtractor}
              setColors={setColors}
            />
          }
        </main>
      </DndContext>
    </>
  )
}