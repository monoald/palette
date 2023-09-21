import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ColorFormats, hexToRgb, rateContrast, validateHex,  } from 'colors-kit'

import { ContrastTable } from '../components/ContrastTable'

import { getMainContrastColor } from '../utils/getMainContrastColor'
import { ColorBlind, ColorType, Palettes, createColor } from '../utils/createSingleColor'

import '../styles/Color.css'

export const Color = () => {
  const { id } = useParams()

  const [color, setColor] = useState<ColorType | null>(null)

  const [inputContrast, setInputContrast] = useState('')

  useEffect(() => {
    const storedColor = localStorage.getItem(`color-${id}`)
    let newColor: ColorType

    if (storedColor) {
      newColor = JSON.parse(storedColor)
    } else {
      newColor = createColor(id as string)
      localStorage.setItem(`color-${id}`, JSON.stringify(newColor))
    }

    setColor(newColor)
    setInputContrast(newColor.mainContrastColor)
  }, [id])

  const handleContrastColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setInputContrast(value)
    validateHex(value)
    if (value.length === 7 || value.length === 4) {
      setColor((currentState: ColorType | null) => {
        const newState: ColorType = {
          ...currentState as ColorType,
          currentContrastColor: value,
          contrastRate: rateContrast([
            hexToRgb(color?.color as string),
            hexToRgb(value)
          ]) 
        }
        return newState
      })
    }
  }

  return (
    <>
      {color &&
        <main className='color__main'>
          <div className='basic-info'>
            <section>
              <div
                className='basic-info__color'
                style={{ background: color.color }}
              >
                <h2
                className='basic-info__name'
                style={{ color: color.mainContrastColor }}
                >
                  {color.color}
                </h2>
              </div>
            </section>

            <section className='formats'>
              <h2 className='color__subtitle'>Formats</h2>
              <div className='table'>
                <div className='table__row'>
                  <p className='table__name'>Hexadecimal</p>
                  <p className='table__value'>{color.color}</p>
                </div>
                {Object.keys(color.allFormats).map(format => (
                  format !== 'hex' &&
                  <div key={format} className='table__row'>
                    <p className='table__name'>{format.toUpperCase()}</p>
                    <p className='table__value'>
                      {Object.values(color.allFormats[format as keyof ColorFormats]  as ColorFormats).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className='basic-palettes'>
            <h2 className='color__subtitle'>Basic Palettes</h2>

            <ul className='items__list items__list--horizontal'>
              { Object.keys(color.palettes).map(palette => (
                <div className='item' key={palette}>
                  <p className='palette-name'>{palette}</p>
                  <li className='item__clr-container'>
                    { color.palettes[palette as keyof Palettes].map(paletteColor => (
                        <div key={paletteColor} className='item__color' style={{
                          background: paletteColor
                        }}>
                          <p className='item__name'
                          style={{
                            color: getMainContrastColor(paletteColor)
                          }}>
                            {paletteColor}
                          </p>
                        </div>
                      ))
                    }
                  </li>
                </div>
              ))
              }
            </ul>
          </section>

          <section className='contrast'>
            <h2 className='color__subtitle'>Contrast</h2>

            <div className='contrast__content'>
              <div className='contrast__colors'>
                <article
                  className='main-color'
                  style={{
                    color: color.mainContrastColor,
                    background: color.color,
                  }}
                >
                  <p className='contrast__name'>{color.color}</p>
                </article>

                <article
                  className='secondary-color'
                  style={{
                    background: color.currentContrastColor
                  }}
                >
                  <input
                    className='contrast__name'
                    type='text'
                    value={inputContrast}
                    onChange={handleContrastColorChanged}
                    maxLength={7}
                    style={{
                      color: getMainContrastColor(color.currentContrastColor)
                    }}
                  />
                </article>
              </div>

              <ContrastTable contrast={color.contrastRate} />
            </div>

          </section>

          <section className='color-blind'>
            <h2 className='color__subtitle'>Color Blind Simulation</h2>
            
            <ul className='color-blind__content'>
              {Object.keys(color.colorBlind).map(blindness => (
                <li className='blindness' key={blindness}>
                  <p className='blindness__name'>
                    {blindness}
                  </p>

                  <div
                    className='blindness__value'
                    style={{
                      background: color?.colorBlind[blindness as keyof ColorBlind]
                    }}
                  >
                    <p
                      className='color-name'
                      style={{ color: getMainContrastColor(color?.colorBlind[blindness as keyof ColorBlind]) }}
                    >
                      {color?.colorBlind[blindness as keyof ColorBlind]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      }
    </>
  )
}