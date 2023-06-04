import { DragEndEvent } from "@dnd-kit/core"
import { AnyFormat } from "../lib/types"
import { Color } from "../pages/PaletteGenerator"
import { createNewColor } from "../utils/createNewColor"
import { PaletteType, makeColorPalette } from "../lib/palette"
import { getMainContrastColor } from "../utils/getMainContrastColor"
import { arrayMove } from "@dnd-kit/sortable"

export const colorInitialState: Color = {
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
}

export interface ColorsPayload {
  color?: AnyFormat
  format?: string
  colorObject?: Color
  paletteType?: string
  event?: DragEndEvent
  newColor?: string
  side?: string
  id?: number
  colors?: Color[]
}

export type ColorsTypes = 
  'set-primary' |
  'update-primary' |
  'secondary' |
  'set-colors' |
  'update-colors' |
  'reorder-colors' |
  'add-color' |
  'lock-color' |
  'remove-color' | 
  'replace-colors'
export type ColorsAction = { type: ColorsTypes, payload?: ColorsPayload }

export interface ColorsReducer {
  primary: Color
  secondary: Color
  colors: Color[]
}

export const colorsInitialState : ColorsReducer = {
  primary: colorInitialState,
  secondary: colorInitialState,
  colors: changePalette('analogous', [])

}

export function colorsReducer(state: ColorsReducer, action: ColorsAction) {
  let newColor: Color = colorInitialState
  let newColors: Color[]

  switch (action.type) {
    case 'set-primary':
      return { ...state, primary: action.payload?.colorObject as Color}
    case 'update-primary':
      newColor = createNewColor(action.payload?.color as AnyFormat, action.payload?.format as string)
      return { ...state, primary: { ...newColor, id: state.primary.id, isLocked: state.primary.isLocked  } }
    case 'secondary':
      newColor = createNewColor(action.payload?.color as string, action.payload?.format as string)
      return { ...state, secondary: { ...newColor, id: state.primary.id || newColor.id } }
    case 'update-colors':
      newColors = updateColors(state.colors, state.primary)
      return { ...state, colors: newColors }
    case 'set-colors':
      newColors = changePalette(action.payload?.paletteType as string, state.colors)
      return { ...state, colors: newColors }
    case 'reorder-colors':
      newColors = reorderColors(action.payload?.event as DragEndEvent, state.colors)
      return { ...state, colors: newColors}
    case 'add-color':
      newColors = addNewColor(state.colors, action.payload?.color as string, action.payload?.newColor as string, action.payload?.side as string)
      return { ...state, colors: newColors }
    case 'lock-color': 
      newColors = lockColor(action.payload?.color as string, state.colors)
      return { ...state, colors: newColors }
    case 'remove-color':
      newColors = removeColor(state.colors, action.payload?.id as number)
      return { ...state, colors: newColors }
    case 'replace-colors': 
      return { ...state, colors: action.payload?.colors as Color[] }
    default:
      return state;
  }
}

function updateColors(colors: Color[], primary: Color): Color[] {
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
    return updatedColors
  }
  return colors
}

function changePalette(paletteType: string, colors: Color[]) {
  const newColors = makeColorPalette({
    randomColor: true,
    format: "hex",
    paletteType: paletteType as PaletteType,
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

  return newObject
}

function reorderColors(event: DragEndEvent, colors: Color[]): Color[] {
  const {active, over} = event
  const dragged = active.id as string
  const target = over?.id as string

  if(dragged !== target) {
    const activeIndex = colors.findIndex(color  => color.id === +dragged)
    const overIndex = colors.findIndex(color  => color.id === +target)

    return arrayMove(colors, activeIndex, overIndex)
  }

  return colors
}

function addNewColor(colors: Color[], color: string, newColor: string, side: string) {
  const mainColorIndex = colors.findIndex(clr => clr.color === color)

  const newObjectColor = createNewColor(newColor, 'hex')
  const newColorIndex = side === 'right' ? mainColorIndex + 1 : mainColorIndex
  
  const newColors = Array.from(colors)
  newColors.splice(newColorIndex, 0, newObjectColor)

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

function removeColor(colors: Color[], id: number) {
  const newColors = Array.from(colors)

  const colorIndex = newColors.findIndex(color => color.id === id)
  newColors.splice(colorIndex, 1)

  return newColors
}
