import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { idToGradient } from '../../utils/idToGradient'
import { gradientToCss } from '../../utils/gradientToCss'
import { gradientToAnimation } from '../../utils/gradientToAnimation'

import { RootState } from '../../app/store'
import { Color } from '../colors/colorsSlice'
import { Palette } from '../palettes/palettesSlice'
import { Gradient } from '../gradient/gradientsSlice'
import { AnimationInfo, GradientAnimation } from '../gradientAnimations/gradientAnimationsSlice'
import { IconCollection } from '../icons/iconsSlice'

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
  icons: Partial<IconCollection>[]
  'gradient-animations': Partial<GradientAnimation>[]
}

interface LoginResponse {
  user: Partial<User> | null
  token: string | null
}

const user = JSON.parse(localStorage.getItem('user') as string) || null

const token = localStorage.getItem('token') || null

export const initialState: LoginResponse = {
  user: user,
  token: token
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
    setSavedGradientAnimations: (state, action: PayloadAction<Partial<GradientAnimation>[]>) => {
      const gradientAnimations = action.payload

      if (state.user) {
        const newGradientAnimations = gradientAnimations.map(gradient => {
          const newGradientAnimation = idToGradient(gradient) as GradientAnimation
          newGradientAnimation.styles = gradientToCss(newGradientAnimation.gradient)
          newGradientAnimation.animation = gradientToAnimation(newGradientAnimation.gradient.animation as AnimationInfo)
          newGradientAnimation.saved = true
          return newGradientAnimation
        })
        state.user['gradient-animations'] = newGradientAnimations
      }
    },
    setSavedIcons: (state, action: PayloadAction<Partial<IconCollection>[]>) => {
      const icons = action.payload

      if(state.user) {
        state.user.icons = icons
      }
    },
    addSavedIcon: (state, action: PayloadAction<Partial<IconCollection>>) => {
      const icon = action.payload

      if(state.user) {
        state.user.icons?.push(icon)
      }
    },
    removeSavedIcon: (state, action: PayloadAction<string>) => {
      const id = action.payload

      if(state.user) {
        const index = state.user.icons?.findIndex(icon => icon.id === id) as number

        if (index !== -1) {
          state.user.icons?.splice(index, 1)
        }
      }
    },
    updateSavedIcon: (state, action: PayloadAction<{ id: string, newIcon: IconCollection}>) => {
      const { id, newIcon } = action.payload

      if(state.user) {
        const index = state.user.icons?.findIndex(icon => icon.id === id) as number

        if (index !== -1) {
          state.user.icons?.splice(index, 1, newIcon)
        }
      }
    },
    signOut: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})

export const {
  setCredentials,
  setSavedColors,
  setSavedPalettes,
  setSavedGradients,
  setSavedGradientAnimations,
  setSavedIcons,
  addSavedIcon,
  removeSavedIcon,
  updateSavedIcon,
  signOut
} = authSlice.actions

export const authReducer = authSlice.reducer

export const selectUser = (state: RootState) => state.auth.user
export const selectToken = (state: RootState) => state.auth.token
export const selectSavedIcons = (state: RootState) => state.auth.user?.icons
export const selectSavedColors = (state: RootState) => state.auth.user?.colors
export const selectSavedPalettes = (state: RootState) => state.auth.user?.palettes
export const selectSavedGradients = (state: RootState) => state.auth.user?.gradients
export const selectSavedGradientAnimations = (state: RootState) => state.auth.user?.['gradient-animations']

export const getIconById = (id: string) =>  (state: RootState) => {
  const ico = state.auth.user?.icons?.find(icon => icon.id === id)
  return ico
}