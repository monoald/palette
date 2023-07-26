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

export const App = () => {
  return (
    <Provider store={store}>
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
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
