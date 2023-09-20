import { useNavigate } from 'react-router-dom'

import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'

import { CollectionLayout } from '../../containers/CollectionLayout'

import { useAppSelector } from '../../app/hooks'
import { selectAllGradients, useGetGradientsQuery } from './gradientsSlice'
import { useTooltip } from '../../hooks/useTooltip'
import Tooltip from '../../components/tooltips/Tooltip'

import '../../styles/UserGradients.css'

export const Gradients = () => {
  const {
    isSuccess,
  } = useGetGradientsQuery({ page: 1 })
  const gradients = useAppSelector(selectAllGradients)

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const likeHandler = useSave(setTooltipMessage)
  const navigate = useNavigate()
  console.log(gradients)

  return (
    <CollectionLayout asideNavigation={false}>
      <CollectionFilter />

      <section className='gradients-container' onClick={likeHandler}>
        <ul className={`items__list items__list--${shape}`}>
          { isSuccess && gradients.map(gradient => (
            <div className='item' key={gradient.id}>
              <li
                className='item__clr-container'
              >
                <button
                  className='item__button'
                  onClick={() => navigate(`/gradient/${gradient.name}`)}
                  style={{
                    position: 'relative',
                    background: gradient.styles.base,
                    '--tetst1': gradient.styles.grid
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
                >
                  <span
                    className={`
                      icon
                      icon-heart${gradient.saved ? '-filled' : ''}
                    `}
                  />
                </button>
              </div>
            </div>
          ))
          }
        </ul>
      </section>

      <Tooltip message={tooltipMessage} />
    </CollectionLayout>
  )
}
