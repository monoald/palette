/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useParams } from 'react-router-dom'
import { Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from 'colors-kit'
import { useKeyDown } from '../hooks/useKeyDown'
import { useTooltip } from '../hooks/useTooltip'

import { Header } from '../components/Header'
import { SideBar } from '../components/SideBar'
import OptionBarContainer from '../containers/OptionBarContainer'
import { ColorBar } from '../components/ColorBar'
import { ContrastCalculator } from '../components/ContrastCalculator'
import { ColorPicker } from '../components/colorPicker/ColorPicker'
import { ImageColorExtractor } from '../components/imageExtractor/ImageColorExtractor'
import Tooltip from '../components/tooltips/Tooltip'

import { optionsInitialState, optionsReducer } from '../reducers/options'
import { colorsInitialState, colorsReducer } from '../reducers/colors'
import { modalsInitialState, modalsReducer } from '../reducers/modals'

import '../assets/icons/style.css'
import '../styles/PaletteGenerator.css'
import { useSave } from '../hooks/useSave'

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
  const [firstRender, setFirstRender] = useState(true)

  const mainRef = useRef<HTMLCanvasElement>(null)

  const { palette } = useParams()

  useEffect(() => {
    if (firstRender) {
      colorsDispatch({ type: 'init-colors', payload: { url: palette } })
      setFirstRender(false)
    }
  }, [colors.colors])

  useKeyDown(() => {
    colorsDispatch({ type: 'set-colors', payload: { paletteType: options.paletteType } })
  }, ['Space'])

  const [tooltipMessage, setTooltipMessage] = useTooltip()

  useEffect(() => {
    if (options.colorBlind !== 'none' && heightColorBlind === 0) {
      setHeightColorBlind(280)
    } 
  }, [options.colorBlind])

  useEffect(() => {
    colorsDispatch({ type: 'update-colors' })
  }, [colors.primary])

  useEffect(() => {
    if (firstRender === false) {
      colorsDispatch({ type: 'set-colors', payload: { paletteType: options.paletteType}})
    }
  }, [options.paletteType])

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

  const saveHandler = useSave(setTooltipMessage, { new: true })

  return (
    <div className='palette-layout'>
      <Header />

      <SideBar
        optionsDispatch={optionsDispatch}
        modalsDispatch={modalsDispatch}
        colorsDispatch={colorsDispatch}
        history={colors.history}
        setTooltipMessage={setTooltipMessage}
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
          onClick={saveHandler}
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
                setTooltipMessage={setTooltipMessage}
              />
            ))} 

          </SortableContext>

          { modals.contrast &&
              <ContrastCalculator
                colors={colors}
                colorsDispatch={colorsDispatch}
                setUpdatedColor={setUpdatedColor}
                modalsDispatch={modalsDispatch}
              />
          }
          { modals.picker && 
              <ColorPicker
                modalsDispatch={modalsDispatch}
                color={updatedColor === 'primary' ? colors.primary : colors.secondary}
                colorsDispatch={colorsDispatch}
                type={updatedColor === 'primary' ? 'update-primary' : 'secondary'}
              />
          }
          { modals['img-extractor'] &&
              <ImageColorExtractor
                modalsDispatch={modalsDispatch}
                colorsDispatch={colorsDispatch}
              />
          }

          <Tooltip message={tooltipMessage}/>
        </main>
      </DndContext>
    </div>
  )
}