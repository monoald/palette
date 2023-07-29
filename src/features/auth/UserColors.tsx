import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'
import { useKeyDown } from '../../hooks/useKeyDown'

import { getMainContrastColor } from '../../utils/getMainContrastColor'

import Tooltip from '../../components/tooltips/Tooltip'

import { selectSavedColors } from './authSlice'
import { useAppSelector } from '../../app/hooks'
import { useSaveColorMutation, Color } from '../colors/colorsSlice'

import '../../styles/UserColors.css'

interface UnsavedColor {
  index: number,
  color: Partial<Color>
}

export const UserColors = () => {
  const [unsavedColor, setUnsavedPalette] = useState<UnsavedColor>()
  const [ableKeyUndo, setAbleKeyUndo] = useState(false)

  const navigate = useNavigate()
  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const saveHandler = useSave(setTooltipMessage)

  const [saveColor] = useSaveColorMutation()
  const colors = useAppSelector(selectSavedColors)

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  useKeyDown(() => {
    if (ableKeyUndo) {
      saveColor({
        name: unsavedColor?.color.name?.substring(1),
        id: unsavedColor?.color.id,
        unsavedColor: unsavedColor
      }).unwrap()
      setAbleKeyUndo(false)
    }
  }, ['KeyZ'])

  const handleSave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('color-like') && colors) {
      const colorIndex = colors?.findIndex(palette => palette.id === target.dataset.id) as number
      setUnsavedPalette({
        index: colorIndex,
        color: colors[colorIndex]
      })
    }
    saveHandler(e)
    setAbleKeyUndo(true)
  }

  return (
    <>
      <CollectionFilter />

      <section className='user-colors' onClick={handleSave}>
        <ul className={`items__list items__list--${shape}`}>
          { colors && colors.map(color => (
            <div className='item' key={color.name}>
              <li
                className='item__clr-container'
                style={{ background: color.name }}
              >
                <button
                  className='item__button'
                  onClick={() => navigate(`/color/${color.name?.substring(1)}`)}
                  style={{
                    color: getMainContrastColor(color.name as string)
                  }}
                >
                  <span className='item__name'>
                    {color.name}
                  </span>
                </button>
              </li>

              <div className='button-container'>
                <button
                  className='color-button color-like'
                  data-name={color.name?.substring(1)}
                  data-saved={color.saved}
                  data-id={color.id}
                  data-section='user'
                >
                  <span className='icon icon-heart-filled txt-primary' />
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
