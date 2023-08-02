import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

import { RootState } from '../../app/store'
import { Color } from '../colors/colorsSlice'
import { Palette } from '../palettes/palettesSlice'

export interface User {
  id: string
  email: string
  name: string
  username: string
  password: string
  avatar: string
  colors: Partial<Color>[]
  palettes: Partial<Palette>[]
}

interface LoginResponse {
  user: Partial<User> | null
  token: string | null
  collectionModified: boolean
}

let user = null
const userCookie = Cookies.get('user')?.substring(2)
if (userCookie) user = JSON.parse(userCookie)

const token = Cookies.get('token') || null

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
    signOut: (state) => {
      state.user = null
      state.token = null
      Cookies.remove('user')
      Cookies.remove('token')
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
  signOut,
  setCollectionModified,
  resetCollectionModified,
} = authSlice.actions

export const authReducer = authSlice.reducer

export const selectUser = (state: RootState) => state.auth.user
export const selectToken = (state: RootState) => state.auth.token
export const selectSavedColors = (state: RootState) => state.auth.user?.colors
export const selectSavedPalettes = (state: RootState) => state.auth.user?.palettes
export const selectCollectionModified = (state: RootState) => state.auth.collectionModified