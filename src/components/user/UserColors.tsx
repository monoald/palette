import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import '../../styles/UserColors.css'
import { useFilter } from '../../hooks/useFilter'

const colors = [
  '#45f2aa',
  '#fe44ef',
  '#e4365f',
  '#099009',
  '#3fabbc',
  '#a4ab0a',
  '#005454',
  '#9800f3'
]

export const UserColors = () => {
  const navigate = useNavigate()

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  return (
    <>
      <CollectionFilter />

      <section className='user-colors'>
        <ul className={`items__list items__list--${shape}`}>
          { colors.map(color => (
            <div className='item' key={color}>
              <li
                className='item__clr-container'
                style={{ background: color }}
              >
                <button
                  className='item__button'
                  onClick={() => navigate(`/color/${color.substring(1)}`)}
                  style={{
                    color: getMainContrastColor(color)
                  }}
                >
                  <span className='item__name'>
                    {color}
                  </span>
                </button>
              </li>

              <div className='button-container'>
                <button className='color-button like-button'>
                  <span className='icon icon-heart-filled txt-primary' />
                </button>
              </div>
            </div>
          ))
          }
        </ul>
      </section>
    </>
  )
}
