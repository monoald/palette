/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { useKeyDown } from '../hooks/useKeyDown'
import { ColorBar } from '../components/ColorBar'
import { ContrastCalculator } from '../components/ContrastCalculator'
import '../assets/icons/style.css'
import '../styles/PaletteGenerator.css'
import { Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from '../lib/types'
import { ColorPicker } from '../components/colorPicker/ColorPicker'
import { Header } from '../components/Header'
import { ImageColorExtractor } from '../components/ImageColorExtractor'
import OptionBarContainer from '../containers/OptionBarContainer'
import { optionsInitialState, optionsReducer } from '../reducers/options'
import { colorsInitialState, colorsReducer } from '../reducers/colors'

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

// {export type ModalsTypes = 'contrast' | 'picker' | 'img-extractor'
// export type ModalsAction = { type: ModalsTypes }

// export interface ModalsReducer {
//   contrast: boolean
//   picker: boolean
//   'img-extractor': boolean
// }

// export const modalsInitialState : ModalsReducer = {
//   contrast: false,
//   picker: false,
//   'img-extractor': false
// }

// export function modalsReducer(state: ModalsReducer, action: ModalsAction) {
//   switch (action.type) {
//     case 'contrast':
//       return { ...state, contrast: !state.contrast }
//     case 'picker':
//       return { ...state, picker: !state.picker }
//     case 'img-extractor':
//       return { ...state, 'img-extractor': !state['img-extractor'] }
//     default:
//       return state;
//   }
// }

// const colorInitialState = {
//   color: '',
//     isLocked: false,
//     contrastColor: '',
//     id: 0,
//     formats: {
//       cmyk: { c: 0, m: 0, y: 0, k:0 },
//       hsb: { h: 0, s: 0, v: 0 },
//       hsl: { h: 0, s: 0, l: 0 },
//       lab: { l: 0, a: 0, b: 0 },
//       rgb: { r: 0, g: 0, b: 0 },
//       xyz: { x: 0, y: 0, z: 0 }
//     },
//     colorBlind: {
//       achromatomaly: '',
//       achromatopsia: '',
//       deuteranomaly: '',
//       deuteranopia: '',
//       protanomaly: '',
//       protanopia: '',
//       tritanomaly: '',
//       tritanopia: '',
//     }
// }}






export const PaletteGenerator = () => {
  const [colors, colorsDispatch] = useReducer(colorsReducer, colorsInitialState)
  const [options, optionsDispatch] = useReducer(optionsReducer, optionsInitialState)
  // const [modals, modalsDispatch] = useReducer(modalsReducer, modalsInitialState)
  const [modalContrast, setModalContrast] = useState<boolean>(false)
  const [modalPicker, setModalPicker] = useState<boolean>(false)
  const [modalImageExtractor, setModalImageExtractor] = useState(false)
  const [heightColorBlind, setHeightColorBlind] = useState(0)
  const [resizeColorBlind, setResizeColorBlind] = useState(false)

  const mainRef = useRef<HTMLCanvasElement>(null)

  useKeyDown(() => {
    colorsDispatch({ type: 'set-colors', payload: { paletteType: options.paletteType } })
  }, ['Space'])

  useEffect(() => {
    if (options.colorBlind !== 'none' && heightColorBlind === 0) {
      setHeightColorBlind(280)
    } 
  }, [options.colorBlind])

  useEffect(() => {
    colorsDispatch({ type: 'update-colors' })
  }, [colors.primary])

  function handleDragEnd(event: DragEndEvent) {
    colorsDispatch({ type: 'reorder-colors', payload: { event } })
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
            items={colors.colors}
            strategy={horizontalListSortingStrategy}
          >
            { colors.colors.map((color: Color) => (
              <ColorBar
                color={color}
                colors={colors.colors}
                setModalContrast={setModalContrast}
                setModalPicker={setModalPicker}
                currentColorBlind={options.colorBlind}
                heightColorBlind={heightColorBlind}
                handleStartResize={handleStartResize}
                resizeColorBlind={resizeColorBlind}
                colorsDispatch={colorsDispatch}
              />
            ))} 

          </SortableContext>
          { modalContrast &&
            <ContrastCalculator
              colors={colors}
              colorsDispatch={colorsDispatch}
              setModalContrast={setModalContrast}
            />
          }
          { modalPicker && 
            <ColorPicker
            setModalColorPicker={setModalPicker}
            color={colors.primary}
            colorsDispatch={colorsDispatch}
            type='update-primary'
            />
          }
          { modalImageExtractor &&
            <ImageColorExtractor
              setModaImageExtractor={setModalImageExtractor}
              colorsDispatch={colorsDispatch}
            />
          }
        </main>
      </DndContext>
    </>
  )
}