import { useAppSelector } from '../app/hooks'
import { selectUser } from '../features/auth/authSlice'
import { useSaveColorMutation, useUnsaveColorMutation } from '../features/colors/colorsSlice'
import { useSaveGradientMutation, useUnsaveGradientMutation } from '../features/gradient/gradientsSlice'
import { useSaveGradientAnimationMutation, useUnsaveGradientAnimationMutation } from '../features/gradientAnimations/gradientAnimationsSlice'
import { useSavePaletteMutation, useUnsavePaletteMutation } from '../features/palettes/palettesSlice'

export const useSave = (
  setTooltipMessage: React.Dispatch<React.SetStateAction<string>>,
  options?: { new?: boolean }
) => {
  const [saveColor] = useSaveColorMutation()
  const [unsaveColor] = useUnsaveColorMutation()

  const [savePalette] = useSavePaletteMutation()
  const [unsavePalette] = useUnsavePaletteMutation()

  const [saveGradient] = useSaveGradientMutation()
  const [unsaveGradient] = useUnsaveGradientMutation()

  const [saveGradientAnimation] = useSaveGradientAnimationMutation()
  const [unsaveGradientAnimation] = useUnsaveGradientAnimationMutation()

  const user = useAppSelector(selectUser)

  const likeHandler = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (user) {
      const target = e.target as HTMLElement
      if (target.classList.contains('color-like')) {
        if (target.dataset.saved === 'true') {
          if (target.dataset.section === 'user') setTooltipMessage('Press "z" to undo.')
          await unsaveColor({
            name: target.dataset.name,
            id: target.dataset.id,
            fromProfile: target.dataset.section === 'user'
          }).unwrap()
        } else {
          saveColor({
            name: target.dataset.name,
            id: target.dataset.id,
            isNew: options?.new || null
          }).unwrap()
        }
      }

      if (target.classList.contains('palette-like')) {
        if (target.dataset.saved === 'true') {
          if (target.dataset.section === 'user') setTooltipMessage('Press "z" to undo.')
          await unsavePalette({
            colors: target.dataset.colors,
            id: target.dataset.id,
            fromProfile: target.dataset.section === 'user'
          }).unwrap()
        } else {
          savePalette({
            colors: target.dataset.colors,
            id: target.dataset.id,
            isNew: options?.new || null
          }).unwrap()
        }
      }

      if (target.classList.contains('gradient-like')) {
        if (target.dataset.saved === 'true') {
          if (target.dataset.section === 'user') setTooltipMessage('Press "z" to undo.')
          await unsaveGradient({
            name: target.dataset.name,
            id: target.dataset.id,
            fromProfile: target.dataset.section === 'user'
          }).unwrap()
        } else {
          saveGradient({
            name: target.dataset.name,
            id: target.dataset.id,
            isNew: options?.new || null
          }).unwrap()
        }
      }

      if (target.classList.contains('gradient-animation-like')) {
        if (target.dataset.saved === 'true') {
          if (target.dataset.section === 'user') setTooltipMessage('Press "z" to undo.')
          await unsaveGradientAnimation({
            name: target.dataset.name,
            id: target.dataset.id,
            fromProfile: target.dataset.section === 'user'
          }).unwrap()
        } else {
          saveGradientAnimation({
            name: target.dataset.name,
            id: target.dataset.id,
            isNew: options?.new || null
          }).unwrap()
        }
      }

      return
    }

    setTooltipMessage('Sign in to save your favorite palettes')
  }
  return likeHandler
}
