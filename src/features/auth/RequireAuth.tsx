import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectToken } from './authSlice'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function RequireAuth() {
  const token = useAppSelector(selectToken)
  const location = useLocation()

  return (
    token
    ? <Outlet />
    : <Navigate to="/signin" state={{ from: location }} replace />
  )
}
