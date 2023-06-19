/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from 'colors-kit'
import { useKeyDown } from '../hooks/useKeyDown'

import { Modal } from '../containers/Modal'
import OptionBarContainer from '../containers/OptionBarContainer'
import { ColorBar } from '../components/ColorBar'
import { ContrastCalculator } from '../components/ContrastCalculator'
import { ColorPicker } from '../components/colorPicker/ColorPicker'
import { Header } from '../components/Header'
import { ImageColorExtractor } from '../components/ImageColorExtractor'

import { optionsInitialState, optionsReducer } from '../reducers/options'
import { colorsInitialState, colorsReducer } from '../reducers/colors'
import { modalsInitialState, modalsReducer } from '../reducers/modals'

import '../assets/icons/style.css'
import '../styles/PaletteGenerator.css'

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
  const [colors, colorsDispatch] = useReducer(colorsReducer, colorsInitialState)
  const [options, optionsDispatch] = useReducer(optionsReducer, optionsInitialState)
  const [modals, modalsDispatch] = useReducer(modalsReducer, modalsInitialState)
  const [heightColorBlind, setHeightColorBlind] = useState(0)
  const [resizeColorBlind, setResizeColorBlind] = useState(false)
  const [updatedColor, setUpdatedColor] = useState<string>('')

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
        modalsDispatch={modalsDispatch}
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
                modalsDispatch={modalsDispatch}
                currentColorBlind={options.colorBlind}
                heightColorBlind={heightColorBlind}
                handleStartResize={handleStartResize}
                resizeColorBlind={resizeColorBlind}
                colorsDispatch={colorsDispatch}
                setUpdatedColor={setUpdatedColor}
              />
            ))} 

          </SortableContext>

          { modals.contrast &&
            <Modal modalsDispatch={modalsDispatch} type='contrast' backgroundOpacity={0.4}>
              <ContrastCalculator
                colors={colors}
                colorsDispatch={colorsDispatch}
                setUpdatedColor={setUpdatedColor}
                modalsDispatch={modalsDispatch}
              />
            </Modal>
          }
          { modals.picker && 
            <Modal modalsDispatch={modalsDispatch} type='picker' backgroundOpacity={0}>
              <ColorPicker
                modalsDispatch={modalsDispatch}
                color={updatedColor === 'primary' ? colors.primary : colors.secondary}
                colorsDispatch={colorsDispatch}
                type={updatedColor === 'primary' ? 'update-primary' : 'secondary'}
              />
            </Modal>
          }
          { modals['img-extractor'] &&
            <Modal modalsDispatch={modalsDispatch} type='img-extractor' backgroundOpacity={0.4}>
              <ImageColorExtractor
                modalsDispatch={modalsDispatch}
                colorsDispatch={colorsDispatch}
              />
            </Modal>
          }
        </main>
      </DndContext>
    </>
  )
}