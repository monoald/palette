import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentToken } from './authSlice'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function RequireAuth() {
  const token = useAppSelector(selectCurrentToken)
  const location = useLocation()

  return (
    token
    ? <Outlet />
    : <Navigate to="/signin" state={{ from: location }} replace />
  )
}
