import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { PaletteGenerator } from '../pages/PaletteGenerator'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import RequireAuth from '../features/auth/RequireAuth'
import { UserRoutes } from './UserRoutes'
import { Color } from '../pages/Color'
import Palettes from '../pages/Palettes'

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
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
