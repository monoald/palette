import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'

import { CollectionLayout } from '../../containers/CollectionLayout'
import Tooltip from '../../components/tooltips/Tooltip'
import { useIntersect } from '../../hooks/useIntersect'
import { useGetPublicPalettesQuery } from './publicPalettesSlice'
import { useState } from 'react'

// eslint-disable-next-line prefer-const
let storedPage = 1

const Palettes = () => {
  const [page, setPage] = useState(storedPage)
  const { data: palettes } = useGetPublicPalettesQuery(page)

  const callback = () => {
    if (!palettes?.entities['no-more-items']) {
      setPage(page + 1)
      storedPage = page + 1
    }
  }
  const [ref] = useIntersect(callback)

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
          { palettes && palettes.ids.map(id => {
            if (id !== 'no-more-items') return (
              <div className='item' key={palettes.entities[id]?.id}>
                <li className='item__clr-container'>
                  { palettes.entities[id]?.colorsArr.map(color => (
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
                    data-colors={palettes.entities[id]?.colors}
                    data-saved={palettes.entities[id]?.saved}
                    data-id={palettes.entities[id]?.id}
                  >
                    <span
                      className={`
                        icon
                        icon-heart${palettes.entities[id]?.saved ? '-filled' : ''}
                      `}
                    />
                  </button>

                  <button
                  className='color-button'
                  onClick={() => editPaletteHandler(palettes.entities[id]?.colors as string)}
                >
                  Edit
                </button>
                </div>
              </div>
            )
          })}

          <span ref={ref} className='pagination-trigger'/>
        </ul>
      </section>
      <Tooltip message={tooltipMessage} />
    </CollectionLayout>
  )
}

export default Palettes