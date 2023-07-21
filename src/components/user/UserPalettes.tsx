import { useNavigate } from 'react-router-dom'
import { useShapeLength } from '../../features/auth/UserTab'
import '../../styles/UserPalettes.css'
import { getMainContrastColor } from '../../utils/getMainContrastColor'
import { Options } from '../Select'

interface Palettes {
  colors: string[],
  length: number
}

const palettes: Palettes[] = [
  {
    colors: ['#ff4335', '#334488', '#8869ef', '#54f6ff'],
    length: 4
  },
  {
    colors: ['#ff4335', '#334488', '#8869ef'],
    length: 3
  },
  {
    colors: ['#f431f0', '#334488', '#8869ef'],
    length: 3
  },
  {
    colors: ['#904f3f', '#334488', '#8869ef', '#feee5f'],
    length: 4
  },
  {
    colors: ['#44a335', '#334488', '#8869ef', '#540000', '#680479'],
    length: 5
  },
  {
    colors: ['#ff4335', '#334488', '#8869ef'],
    length: 3
  },
  {
    colors: ['#ff4335', '#334488', '#8869ef'],
    length: 3
  },
  {
    colors: ['#0f4335', '#330488', '#0069ef', '#383367', '#9090f0'],
    length: 5
  }
]

const uniqueLengths = [...new Set(palettes.map(palette => palette.length.toString()))]
export const lengthOptions: Options = {}
uniqueLengths.forEach(length => {
  lengthOptions[length] = null
})

export const UserPalettes = () => {
  const { shape, length } = useShapeLength()
  const navigate = useNavigate()

  const filteredPalettes = palettes.filter(palette => {
    if (length === 'all') {
      return palette
    } 

    return palette.length === Number(length)
  })

  return (
    <section className='user-palettes'>
      <ul className={`items__list items__list--${shape}`}>
        { filteredPalettes.map(palette => (
          <div className='item' key={palette.colors.join()}>
            <li className='item__clr-container'>
              { palette.colors.map(color => (
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
