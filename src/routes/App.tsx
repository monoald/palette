import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import { PaletteGenerator } from '../pages/PaletteGenerator'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import { Color } from '../pages/Color'
import Palettes from '../features/palettes/Palettes'
import { Colors } from '../features/colors/Colors'

import { store } from '../app/store'
import RequireAuth from '../features/auth/RequireAuth'

import { UserRoutes } from './UserRoutes'
import { authApiSlice } from '../features/auth/authApiSlice'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Loader from '../pages/Loader'

store.dispatch(authApiSlice.endpoints.getSaved.initiate())

export const App = () => {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId='1086718373961-eerfusg737ja6bce29959c7p4bua3qka.apps.googleusercontent.com'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<PaletteGenerator />} />
            <Route path='/:palette' element={<PaletteGenerator />} />

            <Route path='/signin'  element={<SignIn />} />
            <Route path='/signup'  element={<SignUp />} />

            <Route element={<RequireAuth />}>
              <Route path='/user/*' element={<UserRoutes />} />
            </Route>

            <Route path='/color'>
                <Route path='/color/:id' element={<Color />} />
            </Route>

            <Route path='/palettes' element={<Palettes />} />
            <Route path='/colors' element={<Colors />} />

            <Route path='/loader' element={<Loader />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  )
}
