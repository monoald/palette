import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import { useFilter } from '../../hooks/useFilter'
import { useSave } from '../../hooks/useSave'

import { CollectionLayout } from '../../containers/CollectionLayout'

import { useAppSelector } from '../../app/hooks'
import { selectAllColors, useGetColorsQuery } from './colorsSlice'
import { useTooltip } from '../../hooks/useTooltip'
import Tooltip from '../../components/tooltips/Tooltip'

export const Colors = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetColorsQuery({ page: 1 })
  const colors = useAppSelector(selectAllColors)

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
          { isSuccess && colors.map(color => (
            <div className='item' key={color.id}>
              <li
                className='item__clr-container'
                style={{ background: color.name }}
              >
                <button
                  className='item__button'
                  onClick={() => navigate(`/color/${color.name.substring(1)}`)}
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
                  data-name={color.name.substring(1)}
                  data-saved={color.saved}
                  data-id={color.id}
                >
                  <span
                    className={`
                      icon
                      icon-heart${color.saved ? '-filled' : ''}
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
