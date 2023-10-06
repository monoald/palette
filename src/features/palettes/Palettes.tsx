import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'

import { CollectionLayout } from '../../containers/CollectionLayout'
import Tooltip from '../../components/tooltips/Tooltip'

import { store } from '../../app/store'
import { useAppSelector } from '../../app/hooks'
import { publicPaletteApiSlice, selectAllPalettes } from './publicPalettesSlice'

const Palettes = () => {
  const palettes = useAppSelector(selectAllPalettes)

  useEffect(() => {
    if (palettes.length === 0) {
      store.dispatch(publicPaletteApiSlice.endpoints.getPublicPalettes.initiate({ page: 1 }))
    }
  }, [palettes])

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const likeHandler = useSave(setTooltipMessage)
  const navigate = useNavigate()

  const editPaletteHandler = (colors: string) => {
    navigate(`/make-palette/${colors}`)
  }

  return (
    <CollectionLayout asideNavigation={false}>
      <CollectionFilter />

      <section className='user-palettes' onClick={likeHandler}>
        <ul className={`items__list items__list--${shape}`}>
          { palettes.length !== 0 && palettes.map(palette => (
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
          ))}
        </ul>
      </section>
      <Tooltip message={tooltipMessage} />
    </CollectionLayout>
  )
}

export default Palettes