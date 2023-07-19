import { Route, Routes } from "react-router-dom"
import { UserProfile } from "../features/auth/UserTab"
import { UserPalettes } from "../components/user/UserPalettes"
import { UserColors } from "../components/user/UserColors"


export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserProfile />}>
        <Route path='/' element={<UserPalettes />} />
        <Route path='/colors' element={<UserColors />} />
      </Route>
    </Routes>
  )
}
