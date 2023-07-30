import { Route, Routes } from "react-router-dom"
import { CollectionLayout } from "../containers/CollectionLayout"
import { UserPalettes } from "../features/auth/UserPalettes"
import { UserColors } from "../features/auth/UserColors"


export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CollectionLayout />}>
        <Route path='/' element={<UserPalettes />} />
        <Route path='/colors' element={<UserColors />} />
      </Route>
    </Routes>
  )
}
