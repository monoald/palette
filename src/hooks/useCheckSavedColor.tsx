import { useEffect, useState } from 'react'
import { useAppSelector } from '../app/hooks'
import { selectSavedColors } from '../features/auth/authSlice'

export const useCheckSavedColor = (colorHex: string) => {
  const [isSaved, setIsSaved] = useState(false)
  const [savedId, setSavedId] = useState('')

  const colors = useAppSelector(selectSavedColors)

  
  useEffect(() => {
    const savedColor = colors?.find(color => color.name === colorHex)

    setIsSaved(false)
    if (savedColor === undefined) {
      setSavedId('')
    } else {
      setIsSaved(true)
      setSavedId(savedColor.id as string)
    }
  }, [colors, colorHex])
  
  return [isSaved, savedId]
}
