import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'

import { CollectionLayout } from '../../containers/CollectionLayout'
import Tooltip from '../../components/tooltips/Tooltip'

import { useGetColorsQuery } from './colorsSlice'
import { useIntersect } from '../../hooks/useIntersect'
import { useState } from 'react'

// eslint-disable-next-line prefer-const
let storedPage = 1

export const Colors = () => {
  const [page, setPage] = useState(storedPage)
  const { data: colors } = useGetColorsQuery(page)

  const callback = () => {
    if (!colors?.entities['no-more-items']) {
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

  return (
    <CollectionLayout asideNavigation={false}>
      <CollectionFilter />

      <section className='user-colors' onClick={likeHandler}>
        <ul className={`items__list items__list--${shape}`}>
          { colors && colors.ids.map(id => {
            if (id !== 'no-nore-items') return (
              <div className='item' key={colors.entities[id]?.id}>
                <li
                  className='item__clr-container'
                  style={{ background: colors.entities[id]?.name }}
                >
                  <button
                    className='item__button'
                    onClick={() => navigate(`/color/${colors.entities[id]?.name.substring(1)}`)}
                    style={{
                      color: getMainContrastColor(colors.entities[id]?.name as string)
                    }}
                  >
                    <span className='item__name'>
                      {colors.entities[id]?.name}
                    </span>
                  </button>
                </li>

                <div className='button-container'>
                  <button
                    className='color-button color-like'
                    data-name={colors.entities[id]?.name.substring(1)}
                    data-saved={colors.entities[id]?.saved}
                    data-id={colors.entities[id]?.id}
                  >
                    <span
                      className={`
                        icon
                        icon-heart${colors.entities[id]?.saved ? '-filled' : ''}
                      `}
                    />
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