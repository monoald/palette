import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'
import { useKeyDown } from '../../hooks/useKeyDown'

import Tooltip from '../../components/tooltips/Tooltip'

import { selectSavedGradients } from './authSlice'
import { useAppSelector } from '../../app/hooks'
import { useSaveGradientMutation, Gradient } from '../gradient/gradientsSlice'

import '../../styles/UserGradients.css'

interface UnsavedGradient {
  index: number
  gradient: Partial<Gradient>
}

export const UserGradients = () => {
  const [unsavedGradient, setUnsavedGradient] = useState<UnsavedGradient>()
  const [ableKeyUndo, setAbleKeyUndo] = useState(false)

  const navigate = useNavigate()
  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const saveHandler = useSave(setTooltipMessage)

  const [saveGradient] = useSaveGradientMutation()
  const gradients = useAppSelector(selectSavedGradients)

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  useKeyDown(() => {
    if (ableKeyUndo) {
      saveGradient({
        id: unsavedGradient?.gradient.id,
        name: unsavedGradient?.gradient.name,
        styles: unsavedGradient?.gradient.styles,
        unsavedGradient: unsavedGradient
      }).unwrap()
      setAbleKeyUndo(false)
    }
  }, ['KeyZ'])

  const handleSave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('gradient-like') && gradients) {
      const gradientIndex = gradients?.findIndex(gradient => gradient.id === target.dataset.id) as number
      setUnsavedGradient({
        index: gradientIndex,
        gradient: gradients[gradientIndex]
      })
    }
    saveHandler(e)
    setAbleKeyUndo(true)
  }

  return (
    <>
      <CollectionFilter />

      <section className='user-gradients' onClick={handleSave}>
        <ul className={`items__list items__list--${shape}`}>
          { gradients && gradients.map(gradient => (
            <div className='item' key={gradient.name}>
              <li className='item__clr-container'>
                <button
                  className='item__button'
                  onClick={() => navigate(`/gradient/${gradient.name}`)}
                  style={{
                    position: 'relative',
                    background: gradient.styles?.base,
                    '--tetst1': gradient.styles?.grid
                  } as React.CSSProperties}
                >
                </button>
              </li>

              <div className='button-container'>
                <button
                  className='color-button gradient-like'
                  data-name={gradient.name}
                  data-saved={gradient.saved}
                  data-id={gradient.id}
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
