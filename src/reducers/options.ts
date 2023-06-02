export type OptionTypes = 'option' | 'colorBlind' | 'paletteType'
export type OptionsAction = { type: OptionTypes, payload: string }
export interface OptionsReducer {
  option: string
  colorBlind: string
  paletteType: string
}

export const initialState: OptionsReducer = {
  option: 'none',
  colorBlind: 'none',
  paletteType: 'analogous'
}

export function optionsReducer(state: OptionsReducer, action: OptionsAction) {
  switch (action.type) {
    case 'option':
      return { ...state, option: action.payload }
    case 'colorBlind':
      console.log({ ...state, colorBlind: action.payload });
      
      return { ...state, colorBlind: action.payload }
    case 'paletteType':
      return { ...state, paletteType: action.payload }
    default:
      return state;
  }
}