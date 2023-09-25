import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetSavedQuery } from '../features/auth/authApiSlice'

export const Home = () => {
  const navigate = useNavigate()

  const {
    isSuccess,
  } = useGetSavedQuery()

  useEffect(() => {
    navigate('/make-palette')
  }, [navigate])

  return (
    <></>
  )
}