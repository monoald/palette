import { useEffect, useState } from 'react'
import { useAppSelector } from '../app/hooks'
import { selectSavedGradients } from '../features/auth/authSlice'

export const useCheckSavedGradient = (name: string) => {
  const [isSaved, setIsSaved] = useState(false)
  const [savedId, setSavedId] = useState('')

  const gradients = useAppSelector(selectSavedGradients)

  useEffect(() => {
    const savedGradient = gradients?.find(gradient => gradient.name === name)

    setIsSaved(false)
    if (savedGradient === undefined) {
      setSavedId('')
    } else {
      setIsSaved(true)
      setSavedId(savedGradient.id as string)
    }
  }, [gradients, name])
  
  return [isSaved, savedId]
}
