import { useNavigate } from 'react-router-dom'
import { getMainContrastColor } from '../utils/getMainContrastColor'

import { Header } from '../components/Header'
import { useFilter } from '../components/filters/CollectionFilter'

import { useGetPalettesQuery } from '../features/palettes/palettesSlice'

import '../styles/Layout-Pal.css'

const Palettes = () => {
  const navigate = useNavigate()
  const {
    data: palettes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPalettesQuery(1)

  const { shape, CollectionFilter } = useFilter({
    options: {
      shape: true
    }
  })

  return (
    <div className='layout-pal'>
      <Header />

      <main className='User-Profile__main'>
        <CollectionFilter />

        <section className='user-palettes'>
          <ul className={`items__list items__list--${shape}`}>
            { isSuccess && palettes.ids.map(paletteId => (
                <div className='item' key={palettes.entities[paletteId]?.colors}>
                  <li className='item__clr-container'>
                    { palettes.entities[paletteId]?.colorsArr.map(color => (
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
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Palettes