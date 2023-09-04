import { useEffect, useState } from 'react'
import { useAppSelector } from '../app/hooks'
import { selectSavedGradientAnimations } from '../features/auth/authSlice'

export const useCheckSavedGradientAnimation = (name: string) => {
  const [isSaved, setIsSaved] = useState(false)
  const [savedId, setSavedId] = useState('')

  const gradientAnimations = useAppSelector(selectSavedGradientAnimations)

  useEffect(() => {
    const savedGradientAnimation = gradientAnimations?.find(gradient => gradient.name === name)

    setIsSaved(false)
    if (savedGradientAnimation === undefined) {
      setSavedId('')
    } else {
      setIsSaved(true)
      setSavedId(savedGradientAnimation.id as string)
    }
  }, [gradientAnimations, name])
  
  return [isSaved, savedId]
}
