import { CollectionLayout } from '../../containers/CollectionLayout'

import { useAppSelector } from '../../app/hooks'
import { useGetColorsQuery } from './colorsSlice'
import { selectCurrentUser } from '../auth/authSlice'
import { useFilter } from '../../hooks/useFilter'
import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

export const Colors = () => {
  const user = useAppSelector(selectCurrentUser)

  const {
    data: colors,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetColorsQuery({ page: 1, userId: user?.id})

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  const navigate = useNavigate()

  return (
    <CollectionLayout asideNavigation={false}>
      <CollectionFilter />

      <section className='user-colors'>
        <ul className={`items__list items__list--${shape}`}>
          { isSuccess && colors.ids.map(colorId => (
            <div className='item' key={colorId}>
              <li
                className='item__clr-container'
                style={{ background: colors.entities[colorId]?.name }}
              >
                <button
                  className='item__button'
                  onClick={() => navigate(`/color/${colors.entities[colorId]?.name.substring(1)}`)}
                  style={{
                    color: getMainContrastColor(colors.entities[colorId]?.name as string)
                  }}
                >
                  <span className='item__name'>
                    {colors.entities[colorId]?.name}
                  </span>
                </button>
              </li>

              <div className='button-container'>
                <button className='color-button'>
                  <span className={`icon
                    txt-primary
                    icon-heart${colors.entities[colorId]?.userLike ? '-filled' : ''}`}
                  />
                </button>
              </div>
            </div>
          ))
          }
        </ul>
      </section>
    </CollectionLayout>
  )
}
