import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import { useFilter } from '../../hooks/useFilter'

import { CollectionLayout } from '../../containers/CollectionLayout'

import { useAppSelector } from '../../app/hooks'
import { selectAllPalettes, useGetPalettesQuery } from './palettesSlice'

import '../../styles/Layout-Pal.css'
import { useSave } from '../../hooks/useSave'
import Tooltip from '../../components/tooltips/Tooltip'
import { useState } from 'react'
import { useTooltip } from '../../hooks/useTooltip'

const Palettes = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPalettesQuery({ page: 1 })
  const palettes = useAppSelector(selectAllPalettes)

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const likeHandler = useSave(setTooltipMessage)
  const navigate = useNavigate()

  return (
    <CollectionLayout asideNavigation={false}>
      <CollectionFilter />

      <section className='user-palettes' onClick={likeHandler}>
        <ul className={`items__list items__list--${shape}`}>
          { isSuccess && palettes.map(palette => (
              <div className='item' key={palette.id}>
                <li className='item__clr-container'>
                  { palette.colorsArr.map(color => (
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
                  >
                    <span
                      className={`
                        icon
                        txt-primary
                        icon-heart${palette.saved ? '-filled' : ''}
                      `}
                    />
                  </button>

                  <button className='color-button txt-hover-secondary'>
                    Edit
                  </button>
                </div>
              </div>
          ))}
        </ul>
      </section>
      <Tooltip message={tooltipMessage} />
    </CollectionLayout>
  )
}

export default Palettes