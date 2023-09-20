import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import { PaletteGenerator } from '../pages/PaletteGenerator'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import { Color } from '../pages/Color'
import { Gradient } from '../pages/Gradient'
import Loader from '../pages/Loader'

import { store } from '../app/store'
import Palettes from '../features/palettes/Palettes'
import { Colors } from '../features/colors/Colors'
import { authApiSlice } from '../features/auth/authApiSlice'
import RequireAuth from '../features/auth/RequireAuth'

import { UserRoutes } from './UserRoutes'
import { Gradients } from '../features/gradient/Gradients'
import { CreateIconsCollection } from '../pages/CreateIconsCollection'
import EditIconCollection from '../pages/EditIconCollection'

store.dispatch(authApiSlice.endpoints.getSaved.initiate())

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
          <Route path='/gradients' element={<Gradients />} />

          <Route path='/gradient/:id' element={<Gradient />} />
          <Route path='/gradient/' element={<Gradient />} />

          <Route path='/loader' element={<Loader />} />

          <Route path='/create-icons-collection' element={<CreateIconsCollection />} />
          <Route path='/edit-icons-collection/:id' element={<EditIconCollection />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
