import React from 'react'
import { Header } from '../components/Header'
import { Outlet } from 'react-router-dom'

const BasicLayout = () => {
  return (
    <div className='layout'>
      <Header />

      <Outlet />
    </div>
  )
}

export default BasicLayout