/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useAppSelector } from "../app/hooks"
import { selectSavedPalettes } from "../features/auth/authSlice"
import { History } from '../reducers/colors'


export const useCheckSavedPalettes = (history: History) => {
  const [isSaved, setIsSaved] = useState(false)
  const [savedId, setSavedId] = useState('')

  const palettes = useAppSelector(selectSavedPalettes)

  useEffect(() => {
    const savedPalette = palettes?.find(palette => palette.colors === history.data[history.currentIndex])
    setIsSaved(false)
    if (savedPalette === undefined) {
      setSavedId('')
    } else {
      setIsSaved(true)
      setSavedId(savedPalette.id as string)
    }
  }, [history.currentIndex, palettes])

  return [isSaved, savedId]
}
