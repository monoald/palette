import { Route, Routes } from 'react-router-dom'
import { CollectionLayout } from '../containers/CollectionLayout'
import { UserPalettes } from '../features/auth/UserPalettes'
import { UserColors } from '../features/auth/UserColors'
import { resetCollectionModified, selectCollectionModified } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { UserGradients } from '../features/auth/UserGradients'


export const UserRoutes = () => {
  const dispatch = useAppDispatch()

  const isModified = useAppSelector(selectCollectionModified)

  if (isModified) {
    dispatch(resetCollectionModified())
  }
  
  return (
    <Routes>
      <Route path='/' element={<CollectionLayout />}>
        <Route path='/' element={<UserPalettes />} />
        <Route path='/colors' element={<UserColors />} />
        <Route path='/gradients' element={<UserGradients />} />
      </Route>
    </Routes>
  )
}
