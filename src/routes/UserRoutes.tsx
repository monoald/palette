import { Route, Routes } from 'react-router-dom'
import { CollectionLayout } from '../containers/CollectionLayout'
import { UserPalettes } from '../features/auth/UserPalettes'
import { UserColors } from '../features/auth/UserColors'
import { UserGradients } from '../features/auth/UserGradients'
import { UserGradientAnimations } from '../features/auth/UserGradientAnimations'
import { UserIcons } from '../features/auth/UserIcons'


export const UserRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<CollectionLayout />}>
        <Route path='/' element={<UserPalettes />} />
        <Route path='/colors' element={<UserColors />} />
        <Route path='/gradients' element={<UserGradients />} />
        <Route path='/gradient-animations' element={<UserGradientAnimations />} />
        <Route path='/gradient-animations' element={<UserGradientAnimations />} />
        <Route path='/icon-fonts' element={<UserIcons />} />
      </Route>
    </Routes>
  )
}
