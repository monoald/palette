/* eslint-disable no-case-declarations */
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { AnyFormat, Palette, makeColorPalette } from 'colors-kit'

import { createNewColor } from '../utils/createNewColor'
import { getMainContrastColor } from '../utils/getMainContrastColor'
import { paletteToId } from '../utils/paletteToId'
import { idToPalette } from '../utils/idToPalette'

import { Color } from '../pages/PaletteGenerator'

export const colorInitialState: Color = {
  color: '',
  isLocked: false,
  contrastColor: '',
  id: 0,
  formats: {
    cmyk: { c: 0, m: 0, y: 0, k: 0 },
    hsv: { h: 0, s: 0, v: 0 },
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
}

export interface History {
  data: string[]
  currentIndex: number
}

export interface ColorsPayload {
  color?: AnyFormat
  format?: string
  colorObject?: Color
  paletteType?: string
  event?: DragEndEvent
  addedColor?: string
  side?: string
  id?: number
  colors?: Color[]
  url?: string
  history?: string[]
}

export type ColorsTypes = 
  'set-primary' |
  'update-primary' |
  'secondary' |
  'set-colors' |
  'init-colors' |
  'update-colors' |
  'reorder-colors' |
  'add-color' |
  'lock-color' |
  'remove-color' | 
  'replace-colors' |
  'back-palette' | 
  'forward-palette' |
  'replace-primary' |
  'replace-secondary'

export type ColorsAction = { type: ColorsTypes, payload?: ColorsPayload }

export interface ColorsReducer {
  primary: Color
  secondary: Color
  colors: Color[]
  history: History
}

export const colorsInitialState : ColorsReducer = {
  primary: colorInitialState,
  secondary: colorInitialState,
  colors: [],
  history: {
    data: [],
    currentIndex: 0
  }
}

export function colorsReducer(state: ColorsReducer, action: ColorsAction) {
  const history = state.history

  const addedColor = action.payload?.addedColor as string
  const color = action.payload?.color as string
  const colorObject = action.payload?.colorObject as Color
  const colors = action.payload?.colors as Color[]
  const event = action.payload?.event as DragEndEvent
  const format = action.payload?.format as string
  const id = action.payload?.id as number
  let newColor: Color = colorInitialState
  const paletteType = action.payload?.paletteType as string
  const side = action.payload?.side as string
  const url = action.payload?.url as string

  let newColors: Color[]

  switch (action.type) {
    case 'set-primary':
      return { ...state, primary: colorObject}
    case 'update-primary':
      newColor = createNewColor(color, format)
      return { ...state, primary: { ...newColor, id: state.primary.id, isLocked: state.primary.isLocked  } }
    case 'secondary':
      newColor = createNewColor(color, format)
      return { ...state, secondary: { ...newColor, id: state.primary.id || newColor.id } }
    case 'update-colors':
      newColors = updateColors(state.colors, state.primary, history)
      return { ...state, colors: newColors }
    case 'init-colors':
      newColors = initPalette(url, history)
      return { ...state, colors: newColors }
    case 'set-colors':
      newColors = changePalette(paletteType, state.colors, history)
      return { ...state, colors: newColors }
    case 'reorder-colors':
      newColors = reorderColors(event, state.colors, history)
      return { ...state, colors: newColors}
    case 'add-color':
      newColors = addNewColor(state.colors, color, addedColor, side, history)
      return { ...state, colors: newColors }
    case 'lock-color': 
      newColors = lockColor(color, state.colors)
      return { ...state, colors: newColors }
    case 'remove-color':
      newColors = removeColor(state.colors, id, history)
      return { ...state, colors: newColors }
    case 'replace-primary':
      const index = state.colors.findIndex(clr => clr.id === colorObject.id)
      newColors = [...state.colors]
      newColors.splice(index, 1, colorObject)
      return { ...state, colors: newColors }
    case 'replace-secondary':
      return { ...state, secondary: { ...colorObject, id: state.primary.id || colorObject.id } }
    case 'replace-colors':
      const paletteId = paletteToId(colors)
      window.history.replaceState({}, '', `/${paletteId}`)
      return { ...state, colors: colors }
    case 'back-palette':
      newColors = historyPalette(history, 'back')
      return { ...state, colors: newColors }
    case 'forward-palette':
      newColors = historyPalette(history, 'forward')
      return { ...state, colors: newColors }
    default:
      return state
  }
}

function updateColors(colors: Color[], primary: Color, history: History): Color[] {
  const newColor = colors.findIndex(color => color.color === primary.color)

  if (primary.color !== '' && newColor == -1 && colors.length !== 0) {
    const updatedColors = colors.map((clr) => {
      if (clr.id === primary.id) {
        
        return {
          color: primary.color,
          isLocked: clr.isLocked,
          contrastColor: getMainContrastColor(primary.color),
          id: clr.id,
          formats: primary.formats,
          colorBlind: primary.colorBlind
        }
      }
      return clr
    })
    const paletteId = paletteToId(updatedColors)
    history.data.push(paletteId)
    history.currentIndex = history.data.length - 1

    window.history.replaceState({}, '', `/${paletteId}`)

    return updatedColors
  }
  return colors
}

function changePalette(paletteType: string, colors: Color[], history: History): Color[] {
  const newColors = makeColorPalette({
    randomColor: true,
    format: 'hex',
    paletteType: paletteType as Palette,
    quantity: colors.length || 5
  }) as string[]

  const newObject = newColors.map((color): Color => {
    return createNewColor(color, 'hex')
  })

  // Keep locked colors
  const lockedIndex: number[] = []

  colors.forEach((color, index) => {
    if (color.isLocked === true) lockedIndex.push(index)
  })

  lockedIndex.forEach(color => {
    newObject.splice(color, 1, colors[color])
  })

  const paletteId = paletteToId(newObject)
  history.data.push(paletteId)
  history.currentIndex = history.data.length - 1

  window.history.replaceState({}, '', `/${paletteId}`)

  return newObject
}

function reorderColors(event: DragEndEvent, colors: Color[], history: History): Color[] {
  const {active, over} = event
  const dragged = active.id as string
  const target = over?.id as string

  if(dragged !== target) {
    const activeIndex = colors.findIndex(color  => color.id === +dragged)
    const overIndex = colors.findIndex(color  => color.id === +target)

    const newColors = arrayMove(colors, activeIndex, overIndex)

    const paletteId = paletteToId(newColors)
    history.data.push(paletteId)
    history.currentIndex = history.data.length - 1

    window.history.replaceState({}, '', `/${paletteId}`)

    return newColors
  }

  return colors
}

function addNewColor(colors: Color[], color: string, newColor: string, side: string, history: History): Color[] {
  const mainColorIndex = colors.findIndex(clr => clr.color === color)

  const newObjectColor = createNewColor(newColor, 'hex')
  const newColorIndex = side === 'right' ? mainColorIndex + 1 : mainColorIndex
  
  const newColors = Array.from(colors)
  newColors.splice(newColorIndex, 0, newObjectColor)

  const paletteId = paletteToId(newColors)
  history.data.push(paletteId)
  history.currentIndex = history.data.length - 1

  window.history.replaceState({}, '', `/${paletteId}`)

  return newColors
}

function lockColor(color: string, colors: Color[]): Color[] {
  const newColors = colors.map((clr): Color => {
    if (clr.color === color) {
      return {
        color: clr.color,
        isLocked: !clr.isLocked,
        contrastColor: clr.contrastColor,
        id: clr.id,
        formats: clr.formats,
        colorBlind: clr.colorBlind
      }
    }
    return clr
  })

  return newColors
}

function removeColor(colors: Color[], id: number, history: History): Color[] {
  const newColors = Array.from(colors)

  const colorIndex = newColors.findIndex(color => color.id === id)
  newColors.splice(colorIndex, 1)

  const paletteId = paletteToId(newColors)
  history.data.push(paletteId)
  history.currentIndex = history.data.length - 1

  window.history.replaceState({}, '', `/${paletteId}`)

  return newColors
}

function initPalette(url: string | undefined, history: History) {
  if (url === undefined) {
    const colors = changePalette('analogous', [], history)

    return colors
  } else {
    const colors = idToPalette(url)
  
    const newObject = colors.map((color): Color => {
      return createNewColor(color, 'hex')
    })

    const paletteId = paletteToId(newObject)
    history.data.push(paletteId)
    history.currentIndex = history.data.length - 1
    
    return newObject
  }
}

function historyPalette(history: History, type: string) {
  history.currentIndex = type === 'back' ? history.currentIndex - 1 : history.currentIndex + 1

  const colors = idToPalette(history.data[history.currentIndex])

  const newObject = colors.map((color): Color => {
    return createNewColor(color, 'hex')
  })

  return newObject
}