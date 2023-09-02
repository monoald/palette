import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../../app/store'
import { Color } from '../colors/colorsSlice'
import { Palette } from '../palettes/palettesSlice'
import { Gradient } from '../gradient/gradientsSlice'
import { idToGradient } from '../../utils/idToGradient'
import { gradientToCss } from '../../utils/gradientToCss'

export interface User {
  id: string
  email: string
  name: string
  username: string
  password: string
  avatar: string
  colors: Partial<Color>[]
  palettes: Partial<Palette>[]
  gradients: Partial<Gradient>[]
}

interface LoginResponse {
  user: Partial<User> | null
  token: string | null
  collectionModified: boolean
}

const user = JSON.parse(localStorage.getItem('user') as string) || null

const token = localStorage.getItem('token') || null

const initialState: LoginResponse = {
  user: user,
  token: token,
  collectionModified: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token as string)
    },
    setSavedColors: (state, action: PayloadAction<Partial<Color>[]>) => {
      const colors = action.payload

      if (state.user) {
        state.user.colors = colors
      }
    },
    setSavedPalettes: (state, action: PayloadAction<Partial<Palette>[]>) => {
      const palettes = action.payload

      if (state.user) {
        state.user.palettes = palettes
      }
    },
    setSavedGradients: (state, action: PayloadAction<Partial<Gradient>[]>) => {
      const gradients = action.payload

      if (state.user) {
        const newGradients = gradients.map(gradient => {
          const newGradient = idToGradient(gradient)
          newGradient.styles = gradientToCss(newGradient.gradient)
          newGradient.saved = true
          return newGradient
        })
        state.user.gradients = newGradients
      }
    },
    signOut: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    setCollectionModified: (state) => {
      state.collectionModified = true
      
    },
    resetCollectionModified: (state) => {
      state.collectionModified = false
    },
  }
})

export const {
  setCredentials,
  setSavedColors,
  setSavedPalettes,
  setSavedGradients,
  signOut,
  setCollectionModified,
  resetCollectionModified,
} = authSlice.actions

export const authReducer = authSlice.reducer

export const selectUser = (state: RootState) => state.auth.user
export const selectToken = (state: RootState) => state.auth.token
export const selectSavedColors = (state: RootState) => state.auth.user?.colors
export const selectSavedPalettes = (state: RootState) => state.auth.user?.palettes
export const selectSavedGradients = (state: RootState) => state.auth.user?.gradients
export const selectCollectionModified = (state: RootState) => state.auth.collectionModified