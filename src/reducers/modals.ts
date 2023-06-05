export type ModalsTypes = 'contrast' | 'picker' | 'img-extractor'
export type ModalsAction = { type: ModalsTypes }

export interface ModalsReducer {
  contrast: boolean
  picker: boolean
  'img-extractor': boolean
}

export const modalsInitialState : ModalsReducer = {
  contrast: false,
  picker: false,
  'img-extractor': false
}

export function modalsReducer(state: ModalsReducer, action: ModalsAction) {
  switch (action.type) {
    case 'contrast':
      return { ...state, contrast: !state.contrast }
    case 'picker':
      return { ...state, picker: !state.picker }
    case 'img-extractor':
      return { ...state, 'img-extractor': !state['img-extractor'] }
    default:
      return state;
  }
}