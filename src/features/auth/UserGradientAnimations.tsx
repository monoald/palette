import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'
import { useKeyDown } from '../../hooks/useKeyDown'

import Tooltip from '../../components/tooltips/Tooltip'

import { selectSavedGradientAnimations } from './authSlice'
import { useAppSelector } from '../../app/hooks'
import { useSaveGradientAnimationMutation, GradientAnimation } from '../gradientAnimations/gradientAnimationsSlice'

import '../../styles/UserGradients.css'

interface UnsavedGradientAnimation {
  index: number
  gradientAnimation: Partial<GradientAnimation>
}

export const UserGradientAnimations = () => {
  const [unsavedGradientAnimation, setUnsavedGradientAnimation] = useState<UnsavedGradientAnimation>()
  const [ableKeyUndo, setAbleKeyUndo] = useState(false)

  const navigate = useNavigate()
  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const saveHandler = useSave(setTooltipMessage)

  const [saveGradientAnimation] = useSaveGradientAnimationMutation()
  const gradientAnimations = useAppSelector(selectSavedGradientAnimations)

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  useKeyDown(() => {
    if (ableKeyUndo) {
      saveGradientAnimation({
        id: unsavedGradientAnimation?.gradientAnimation.id,
        name: unsavedGradientAnimation?.gradientAnimation.name,
        styles: unsavedGradientAnimation?.gradientAnimation.styles,
        unsavedGradientAnimation: unsavedGradientAnimation
      }).unwrap()
      setAbleKeyUndo(false)
    }
  }, ['KeyZ'])

  const handleSave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('gradient-animation-like') && gradientAnimations) {
      const gradientAnimationIndex = gradientAnimations?.findIndex(gradientAnimation => gradientAnimation.id === target.dataset.id) as number
      setUnsavedGradientAnimation({
        index: gradientAnimationIndex,
        gradientAnimation: gradientAnimations[gradientAnimationIndex]
      })
    }
    saveHandler(e)
    setAbleKeyUndo(true)
  }

  return (
    <>
      <CollectionFilter />

      <section className='user-gradient' onClick={handleSave}>
        <ul className={`items__list items__list--${shape}`}>
          { gradientAnimations && gradientAnimations.map(gradientAnimation => (
            <div className='item' key={gradientAnimation.name}>
              <li className='item__clr-container'>
                <button
                  className='item__button'
                  onClick={() => navigate(`/gradient/${gradientAnimation.name}`)}
                  style={{
                    width: gradientAnimation.gradient?.animation?.type === 'spin' ? '110%' : '100%',
                    height: gradientAnimation.gradient?.animation?.type === 'spin' ? '280%' : '100%',
                    position: 'relative',
                    '--background-size': gradientAnimation.gradient?.animation?.size,
                    '--background': gradientAnimation.styles?.base,
                    '--tetst1': gradientAnimation.styles?.grid,
                    animation: gradientAnimation.animation,
                  } as React.CSSProperties}
                >
                </button>
              </li>

              <div className='button-container'>
                <button
                  className='color-button gradient-animation-like'
                  data-name={gradientAnimation.name}
                  data-saved={gradientAnimation.saved}
                  data-id={gradientAnimation.id}
                  data-section='user'
                >
                  <span className='icon icon-heart-filled' />
                </button>
              </div>
            </div>
          ))
          }
        </ul>
      </section>

      <Tooltip message={tooltipMessage} />
    </>
  )
}
