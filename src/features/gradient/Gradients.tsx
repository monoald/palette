import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'
import { useTooltip } from '../../hooks/useTooltip'
import { useIntersect } from '../../hooks/useIntersect'

import { CollectionLayout } from '../../containers/CollectionLayout'
import Tooltip from '../../components/tooltips/Tooltip'

import { useGetPublicGradientsQuery } from './publicGradientsSlice'

import '../../styles/UserGradients.css'

// eslint-disable-next-line prefer-const
let storedPage = 1

export const Gradients = () => {
  const [page, setPage] = useState(storedPage)
  const { data: gradients } = useGetPublicGradientsQuery(page)
  
  const callback = () => {
    if (!gradients?.entities['no-more-items']) {
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

      <section className='gradients-container' onClick={likeHandler}>
        <ul className={`items__list items__list--${shape}`}>
          { gradients && gradients.ids.map(id => {
            if (id !== 'no-more-items') return (
              <div className='item' key={gradients.entities[id]?.id}>
                <li
                  className='item__clr-container'
                >
                  <button
                    className='item__button'
                    onClick={() => navigate(`/gradient/${gradients.entities[id]?.name}`)}
                    style={{
                      position: 'relative',
                      background: gradients.entities[id]?.styles.base,
                      '--tetst1': gradients.entities[id]?.styles.grid
                    } as React.CSSProperties}
                  >
                  </button>
                </li>

                <div className='button-container'>
                  <button
                    className='color-button gradient-like'
                    data-name={gradients.entities[id]?.name}
                    data-saved={gradients.entities[id]?.saved}
                    data-id={gradients.entities[id]?.id}
                  >
                    <span
                      className={`
                        icon
                        icon-heart${gradients.entities[id]?.saved ? '-filled' : ''}
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
