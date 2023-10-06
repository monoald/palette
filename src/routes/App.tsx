import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import { PaletteGenerator } from '../pages/PaletteGenerator'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import { Color } from '../pages/Color'
import { Gradient } from '../pages/Gradient'
import Loader from '../pages/Loader'
import EditIconCollection from '../pages/EditIconCollection'
import { Home } from '../pages/Home'
import { CreateIconsCollection } from '../pages/CreateIconsCollection'

import { store } from '../app/store'
import Palettes from '../features/palettes/Palettes'
import { Colors } from '../features/colors/Colors'
import { authApiSlice } from '../features/auth/authApiSlice'
import RequireAuth from '../features/auth/RequireAuth'
import { Gradients } from '../features/gradient/Gradients'
import { initialState as auth } from '../features/auth/authSlice'

import { UserRoutes } from './UserRoutes'
import BasicLayout from '../containers/BasicLayout'
import { NotFound } from '../pages/404'
import { useEffect } from 'react'


export const App = () => {
  useEffect(() => {
    if (auth.user && auth.token) {
      store.dispatch(authApiSlice.endpoints.getSaved.initiate())
    }
  }, [])
  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<BasicLayout />}>
            <Route path='/' element={<Home />} />

            <Route path='/make-palette' element={<PaletteGenerator />} />
            <Route path='/make-palette/:palette' element={<PaletteGenerator />} />

            <Route element={<RequireAuth />}>
              <Route path='/user/*' element={<UserRoutes />} />
            </Route>

            <Route path='/palettes' element={<Palettes />} />
            <Route path='/colors' element={<Colors />} />
            <Route path='/gradients' element={<Gradients />} />

            <Route path='/color'>
              <Route path='/color/:id' element={<Color />} />
            </Route>

            <Route path='/gradient/' element={<Gradient />}>
              <Route path='/gradient/:id' element={<Gradient />} />
            </Route>

            <Route path='/icons'>
              <Route path='/icons/create' element={<CreateIconsCollection />} />
              <Route path='/icons/edit/:id' element={<EditIconCollection />} />
            </Route>

            <Route path='/*' element={<NotFound />} />
            <Route path='/404' element={<NotFound />} />
          </Route>

          <Route path='/signin'  element={<SignIn />} />
          <Route path='/signup'  element={<SignUp />} />
          <Route path='/loader' element={<Loader />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
