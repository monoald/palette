import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { RootState } from '../../app/store'

export interface User {
  id: string
  email: string
  name?: string
  username: string
  password: string
  avatar?: string
}

interface LoginResponse {
  user: User | null,
  token: string | null,
}

let user
const userCookie = Cookies.get('user')?.substring(2)
if (userCookie) user = JSON.parse(userCookie)

const token = Cookies.get('token') || null

const initialState: LoginResponse = {
  user: user || null,
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
    },
    logOut: (state) => {
      state.user = null
      state.token = null
      Cookies.remove('user')
      Cookies.remove('token')
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export const authReducer = authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectCurrentToken = (state: RootState) => state.auth.token