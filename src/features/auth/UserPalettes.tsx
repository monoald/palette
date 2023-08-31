import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'
import { useKeyDown } from '../../hooks/useKeyDown'

import { getMainContrastColor } from '../../utils/getMainContrastColor'

import { Options } from '../../components/Select'
import Tooltip from '../../components/tooltips/Tooltip'

import { useAppSelector } from '../../app/hooks'
import { selectSavedPalettes } from './authSlice'
import { Palette, useSavePaletteMutation } from '../palettes/palettesSlice'

import '../../styles/UserPalettes.css'

interface UnsavedPalette {
  index: number,
  palette: Partial<Palette>
}

export const UserPalettes = () => {
  const [unsavedPalette, setUnsavedPalette] = useState<UnsavedPalette>()
  const [ableKeyUndo, setAbleKeyUndo] = useState(false)

  const navigate = useNavigate()
  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const saveHandler = useSave(setTooltipMessage)

  const [savePalette] = useSavePaletteMutation()
  const palettes = useAppSelector(selectSavedPalettes)

  const uniqueLengths = [...new Set(palettes?.map(palette => palette.length?.toString()))]
  const quantityOptions: Options = {}
  uniqueLengths.forEach(length => {
    if (typeof length === 'string') {
      quantityOptions[length] = null
    }
  })

  const { shape, quantity, CollectionFilter } = useFilter({
    options: {
      shape: true,
      quantity: true,
      quantityOptions: quantityOptions
    }
  })
  const filteredPalettes = palettes?.filter(palette => {
    if (quantity === 'all') {
      return palette
    } 

    return palette.length === Number(quantity)
  })

  useKeyDown(() => {
    if (ableKeyUndo) {
      savePalette({
        colors: unsavedPalette?.palette.colors,
        id: unsavedPalette?.palette.id,
        unsavedPalette: unsavedPalette,
        undoAction: true
      }).unwrap()
      setAbleKeyUndo(false)
    }
  }, ['KeyZ'])

  const handleSave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('palette-like') && palettes) {
      const paletteIndex = palettes?.findIndex(palette => palette.id === target.dataset.id) as number
      setUnsavedPalette({
        index: paletteIndex,
        palette: palettes[paletteIndex]
      })
    }
    saveHandler(e)
    setAbleKeyUndo(true)
  }

  const editPaletteHandler = (colors: string) => {
    navigate(`/${colors}`)
  }

  return (
    <>
      <CollectionFilter />

      <section className='user-palettes' onClick={handleSave}>
        <ul className={`items__list items__list--${shape}`}>
          { filteredPalettes && filteredPalettes.map(palette => (
            <div className='item' key={palette.colors}>
              <li className='item__clr-container'>
                { palette.colorsArr && palette.colorsArr.map(color => (
                    <button key={color}
                      className='item__color'
                      onClick={() => navigate(`/color/${color.substring(1)}`)}
                      style={{
                        background: color
                      }}
                    >
                      <span className='item__name'
                      style={{
                        color: getMainContrastColor(color)
                      }}>
                        {color}
                      </span>
                    </button>
                  ))
                }
              </li>

              <div className='button-container'>
                <button
                  className='color-button palette-like'
                  data-colors={palette.colors}
                  data-saved={palette.saved}
                  data-id={palette.id}
                  data-section='user'
                >
                  <span
                    className={`
                      icon
                      icon-heart${palette.saved ? '-filled' : ''}
                    `}
                  />
                </button>

                <button
                  className='color-button'
                  onClick={() => editPaletteHandler(palette.colors as string)}
                >
                  Edit
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
