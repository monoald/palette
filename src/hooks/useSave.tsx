import { useAppSelector } from "../app/hooks"
import { selectCurrentUser } from "../features/auth/authSlice"
import { useSaveColorMutation, useUnsaveColorMutation } from "../features/colors/colorsSlice"
import { useSavePaletteMutation, useUnsavePaletteMutation } from "../features/palettes/palettesSlice"

export const useSave = (setTooltipMessage: React.Dispatch<React.SetStateAction<string>>) => {
  const [saveColor] = useSaveColorMutation()
  const [unsaveColor] = useUnsaveColorMutation()

  const [savePalette] = useSavePaletteMutation()
  const [unsavePalette] = useUnsavePaletteMutation()

  const user = useAppSelector(selectCurrentUser)

  const likeHandler = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (user) {
      const target = e.target as HTMLElement
      if (target.classList.contains('color-like')) {
        if (target.dataset.saved === 'true') {
          await unsaveColor({
            name: target.dataset.name,
            id: target.dataset.id
          }).unwrap()
        } else {
          saveColor({
            name: target.dataset.name,
            id: target.dataset.id
          }).unwrap()
        }
      }

      if (target.classList.contains('palette-like')) {
        if (target.dataset.saved === 'true') {
          await unsavePalette({
            colors: target.dataset.colors,
            id: target.dataset.id
          }).unwrap()
        } else {
          savePalette({
            colors: target.dataset.colors,
            id: target.dataset.id
          }).unwrap()
        }
      }

      return
    }

    setTooltipMessage('Sign in to save your favorite palettes')
  }
  return likeHandler
}
