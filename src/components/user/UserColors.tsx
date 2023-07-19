import { useShapeLength } from '../../features/auth/UserTab'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import '../../styles/UserColors.css'

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
  const { shape, length } = useShapeLength()

  return (
    <section className='user-colors'>
      <ul className={`items__list items__list--${shape}`}>
        { colors.map(color => (
          <div className='item' key={color}>
            <li
              className='item__clr-container'
              style={{ background: color }}
            >
              <p className='item__name'
              style={{
                color: getMainContrastColor(color)
              }}>
                {color}
              </p>
            </li>

            <div className='button-container'>
              <button className='color-button'>
                <span className='icon icon-heart-filled txt-primary' />
              </button>

              <button className='color-button txt-hover-secondary'>
                Edit
              </button>
            </div>
          </div>
        ))
        }
      </ul>
    </section>
  )
}
