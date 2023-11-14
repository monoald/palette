import { Header } from '../components/Header'
import { Outlet } from 'react-router-dom'

import '../styles/BasicLayout.css'

const BasicLayout = () => {
  return (
    <div className='layout'>
      <Header />

      <Outlet />
    </div>
  )
}

export default BasicLayout