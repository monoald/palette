import { Route, Routes } from "react-router-dom"
import { CollectionLayout } from "../containers/CollectionLayout"
import { UserPalettes } from "../components/user/UserPalettes"
import { UserColors } from "../components/user/UserColors"


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
