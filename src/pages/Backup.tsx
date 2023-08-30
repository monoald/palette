import { ReactNode, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, Over, UniqueIdentifier, closestCorners, useDroppable } from '@dnd-kit/core'
import { SortableContext, arrayMove,  rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015, darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { getStops } from '../utils/getStops'
import { isArrayAscending } from '../utils/isArrayAscending'

import { Header } from '../components/Header'
import { AngleInput } from '../components/gradient/AngleInput'
import { ColorPicker, PickerColor } from '../components/picker/ColorPicker'

import '../styles/Gradient.css'

const injectStyle = (style: string) => {
  const styleElement = document.createElement('style');
  let styleSheet = null;

  document.head.appendChild(styleElement);

  styleSheet = styleElement.sheet;

  styleSheet?.insertRule(style, styleSheet.cssRules.length);
};

interface Color {
  color: string
  id: number
}
interface GradientColor {
  colors: Color[]
  stops: number[],
}

interface GradientColors {
  firstRow: GradientColor
  secondRow?: GradientColor
}

function makeGradient(container: GradientColor) {
  let basicGradient = ''
  container.colors.map((color, index) => {
    basicGradient += `, ${color.color} ${container.stops[index]}%`
  })

  return basicGradient
}

function findIdInColors(id: string, colors: Color[]): number {
  let colorIndex = -1
  colors.forEach((color, index) => {
    if (color.id === +id) colorIndex = index
  })

  return colorIndex
}

interface DGradientType {
  type: string
  angle: number
  firstRow?: GradientColor
  secondRow?: GradientColor
  activeId?: Color
}

export const Gradient = () => {
  const [type, setType] = useState('horizontal')
  const [angle, setAngle] = useState(90)
  const [firstRow, setFirstRow] = useState<GradientColor>()
  const [secondRow, setSecondRow] = useState<GradientColor>()
  const [activeId, setActiveId] = useState<Color>()
  
  const [gradient, setGradient] = useState<string[]>([])
  const [gridGradient, setGridGradient] = useState(['',''])

  const [openPicker, setOpenPicker] = useState<boolean>(false)

  const [mode, setMode] = useState('gradient')
  const [codeTech, setCodeTech] = useState('css')

  const { id } = useParams()

  useEffect(() => {
    // Change colors and stops
    if (
      (type === 'vertical' || type === 'horizontal' || type === 'circle')
      && secondRow
    ) {
      setFirstRow(prev => {
        if (prev) {
          const newColors = [ ...prev.colors, ...secondRow.colors as Color[]]
  
          const newStops = getStops(100 / (newColors.length - 1))
  
          return {
            colors: newColors,
            stops: newStops,
          }
        }
      })

      setSecondRow(undefined)
    } else if (type === 'grid' && !secondRow){
      setFirstRow(prev => {
        if (prev) {
          const middleIndex = Math.ceil(prev.colors.length / 2)
          const newColors = prev.colors.splice(middleIndex)
  
          const newStopsFirstRow = getStops(100 / (prev.colors.length - 1))
  
          const newStopsSecondRow = getStops(100 / (newColors.length - 1))
  
          setSecondRow({
            colors: newColors,
            stops: newStopsSecondRow
          })
  
          return {
            colors: prev.colors,
            stops: newStopsFirstRow
          }
        }
      })
    }

    const newAngle = type === 'vertical' ? 180 : 90
    const newGradient = type === 'circle' ? 'radial-gradient(circle' : `linear-gradient(${newAngle}deg`

    setAngle(newAngle)
    setGradient(prev => {
      const newGrad = [...prev]
      newGrad[0] = newGradient
      return newGrad
    })

    if (type === 'grid') {
      setGridGradient(prev => {
        const newGradient = [...prev]
        newGradient[0] = `linear-gradient(${90}deg`
        newGradient[1] = secondRow ? makeGradient(secondRow): ''
        return newGradient
      })
    }

    gradientToUrl()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondRow, type])

  useEffect(() => {
    if (firstRow) {
      setGradient(prev => {
        const newGradient = [...prev]
        newGradient[1] = makeGradient(firstRow)
        return newGradient
      })
  
      if (type === 'grid') {
        setGridGradient(prev => {
          const newGradient = [...prev]
          newGradient[1] = secondRow ? makeGradient(secondRow): ''
          return newGradient
        })
      }
  
      if (openPicker && activeId) {
        const isOnFirstRow = findIdInColors(`${activeId.id}`, firstRow.colors)
        const isOnSecondRow = secondRow ? findIdInColors(`${activeId.id}`, secondRow?.colors as Color[]) : -1
  
        const activeC = firstRow.colors[isOnFirstRow] || secondRow?.colors[isOnSecondRow]
  
        if (activeC.color !== activeId.color) {
          setActiveId({ id: activeId.id, color: activeC.color })
        }
      }
  
      gradientToUrl()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRow, secondRow])

  useEffect(() => {
    if (type === 'horizontal' || type === 'vertical') {
      setGradient(prev => {
        const newGradient = [...prev]
        newGradient[0] = `linear-gradient(${angle}deg`
        return newGradient
      })
    }

    gradientToUrl()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angle])

  useEffect(() => {
    const urlParams = new URLSearchParams(id)

    const newType = urlParams.get('t')
    const newAngle = urlParams.get('a')
    const newFirstRow: GradientColor = {
      colors: [],
      stops: []
    }

    urlParams.get('r1')?.split('_').forEach(color => {
      const obj = color.split('-')

      newFirstRow.colors.push({
        id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
        color: `#${obj[0]}`
      })
      newFirstRow.stops.push(+obj[1])
    })

    setFirstRow(newFirstRow)

    if (newType !== null) {
      setType(newType)
    }
    if (newAngle !== null) {
      setAngle(+newAngle)
    }

    if (urlParams.get('r2') && newType === 'grid') {
      const newSecondRow: GradientColor = {
        colors: [],
        stops: []
      }
  
      urlParams.get('r2')?.split('_').forEach(color => {
        const obj = color.split('-')
  
        newSecondRow.colors.push({
          id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
          color: `#${obj[0]}`
        })
        newSecondRow.stops.push(+obj[1])
      })
  
      setSecondRow(newSecondRow)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gradientToUrl = () => {
    let newType = ''
    let newAngle = ''
    let newRow1 = 'r1='
    let newRow2 = ''

    if (
      (type === 'horizontal' && angle === 90) ||
      (type === 'vertical' && angle === 180) ||
      type === 'grid' || type === 'circle'
    ) {
      newType = `t=${type}&`
    }

    if (
      (type === 'horizontal' && angle !== 90) ||
      (type === 'vertical' && angle !== 180)
    ) {
      newAngle = `a=${angle}&`
    }

    firstRow?.colors.forEach((color, index) => {
      newRow1 += `${color.color.substring(1)}-${firstRow.stops[index]}_`
    })
    newRow1 = newRow1.slice(0, -1)

    if (secondRow) {
      newRow2 = '&r2='
      secondRow.colors.forEach((color, index) => {
        newRow2 += `${color.color.substring(1)}-${secondRow.stops[index]}_`
      })
      newRow2 = newRow2.slice(0, -1)
    }

    const newUrl = '/gradient/' + newType + newAngle + newRow1 + newRow2

    window.history.replaceState({}, '', newUrl)
  }

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e
    const { id } = active

    if (firstRow) {
      const isOnFirstRow = findIdInColors(id as string, firstRow.colors)
      const isOnSecondRow = secondRow ? findIdInColors(id as string, secondRow?.colors as Color[]) : -1
  
      const activeC = firstRow.colors[isOnFirstRow] || secondRow?.colors[isOnSecondRow]
  
      setActiveId(activeC)
    }
  }

  const findContainer = (id: UniqueIdentifier) => {
    if (id === 'firsRow' || id === 'secondRow') return id

    if (firstRow && findIdInColors(id as string, firstRow.colors) !== -1) return 'firstRow'

    if (secondRow?.colors && findIdInColors(id as string, secondRow?.colors) !== -1) return 'secondRow'
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    const { id } = active
    const { id: overId } = over as Over

    // Find the containers
    const activeContainer = findContainer(id) as keyof GradientColors
    const overContainer = findContainer(overId) as keyof GradientColors

    if (
      !activeContainer ||
      !overContainer
    ) {
      return
    }

    if (secondRow && firstRow) {
      const activeColors = activeContainer === 'firstRow' ? [...firstRow.colors] : [...secondRow.colors]
      const overColors = overContainer === 'secondRow' ? [...secondRow.colors] : [...firstRow.colors]
      
      const activeIndex = findIdInColors(id as string, activeColors)
      const overIndex = findIdInColors(overId as string, overColors)

      const activeColor = activeColors[activeIndex]

      activeColors.splice(activeIndex as number, 1)
      overColors.splice(overIndex as number, 0, activeColor)

      const activeStops = getStops(100 / (activeColors.length - 1))
      const overStops = getStops(100 / (overColors.length - 1))

      if (activeContainer === 'firstRow' && overContainer === 'secondRow') {
        setFirstRow({ colors: activeColors, stops: activeStops })
        setSecondRow({ colors: overColors, stops: overStops })
      } else if (activeContainer === 'secondRow' && overContainer === 'firstRow') {
        setFirstRow({ colors: overColors, stops: overStops })
        setSecondRow({ colors: activeColors, stops: activeStops })
      }
    }

    if (activeContainer === 'firstRow' && overContainer === 'firstRow') {
      setFirstRow(prev => {
        if (prev) {
          const activeIndex = findIdInColors(id as string, prev.colors)
          const overIndex = findIdInColors(overId as string, prev.colors)
  
          const newColors = arrayMove(prev.colors, activeIndex, overIndex)
          
          return {
            ...prev,
            colors: newColors
          }
        }
      })
    } else if (activeContainer === 'secondRow' && overContainer === 'secondRow') {
      setSecondRow(prev => {
        if (prev) {
          const activeIndex = findIdInColors(id as string, prev.colors)
          const overIndex = findIdInColors(overId as string, prev.colors)
  
          const newColors = arrayMove(prev.colors, activeIndex, overIndex)
          
          return {
            ...prev,
            colors: newColors
          }
        }
      })
    }
  }

  const handleAngleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setAngle(+target.value)
  }

  const updateColor = (color: PickerColor) => {
    if (firstRow) {
      const isOnFirstRow = findIdInColors(color.id as string, firstRow.colors)
      const isOnSecondRow = secondRow ? findIdInColors(color.id as string, secondRow?.colors as Color[]) : -1
  
      if (isOnFirstRow !== -1) {
        setFirstRow(prev => {
          if (prev) {
            const newColors = [...prev.colors]
            newColors[isOnFirstRow] = {
              id: +color.id,
              color: color.formats.hex as string
            }
            return {
              colors: newColors,
              stops: prev.stops
            }
          }
        })
      } else if (isOnSecondRow !== -1) {
        setSecondRow(prev => {
          if (prev) {
            const newColors = [...prev.colors]
            newColors[isOnSecondRow] = {
              id: +color.id,
              color: color.formats.hex as string
            }
            return {
              colors: newColors,
              stops: prev.stops
            }
          }
        })
      }
    }
  }

  const handleRemoveColor = () => {
    if (activeId && firstRow) {
      const isOnFirstRow = findIdInColors(`${activeId.id}`, firstRow.colors)
      const isOnSecondRow = secondRow ? findIdInColors(`${activeId.id}`, secondRow?.colors as Color[]) : -1

      if (isOnFirstRow !== -1) {
        setFirstRow(prev => {
          if (prev) {
            const newRow = { ...prev }
            newRow.colors.splice(isOnFirstRow, 1)
            newRow.stops.splice(isOnFirstRow, 1)
            return newRow
          }
        })
      } else if (isOnSecondRow !== -1) {
        setSecondRow(prev => {
          if (prev) {
            const newRow = { ...prev }
            newRow.colors.splice(isOnSecondRow, 1)
            newRow.stops.splice(isOnSecondRow, 1)
            return newRow
          }
        })
      }
    }

    setActiveId(undefined)
  }

  const handleAddColor = (row: string) => {
    if (row === 'first') {
      setFirstRow(prev => {
        if (prev) {
          const newRow = { ...prev }
          newRow.colors.push({
            id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
            color: '#ffffff'
          })
          newRow.stops = getStops(100 / (newRow.colors.length - 1))
          return newRow
        }
      })
    } else if (row === 'second') {
      setSecondRow(prev => {
        if (prev) {
          const newRow = { ...prev }
          newRow.colors.push({
            id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
            color: '#ffffff'
          })
          newRow.stops = getStops(100 / (newRow.colors.length - 1))
          return newRow
        }
      })
    }
  }

  const handleClosePicker = () => {
    setOpenPicker(false)
  }

  // const cssCode = `
  // .my-object {
  //   background: ${gradient[0]}${gradient[1]});
  //   background: -o-${gradient[0]}${gradient[1]});
  //   background: -ms-${gradient[0]}${gradient[1]});
  //   background: -moz-${gradient[0]}${gradient[1]});
  //   background: -webkit-${gradient[0]}${gradient[1]});
  //   ${ type === 'grid' ? 'position: relative;' : ''}
  // }

  // ${ type === 'grid' ?
  //   `.my-object::after {
  //     content: "";
  //     position: absolute;
  //     top: 0; left: 0; bottom: 0; right: 0;
  //     mask-image: linear-gradient(to bottom, transparent 50%, black);
  //     -webkit-mask-image: linear-gradient(to bottom, transparent 30%, black);
  //     background: ${gridGradient[0]}${gridGradient[1]});
  //     background: -o-${gridGradient[0]}${gridGradient[1]});
  //     background: -ms-${gridGradient[0]}${gridGradient[1]});
  //     background: -moz-${gridGradient[0]}${gridGradient[1]});
  //     background: -webkit-${gridGradient[0]}${gridGradient[1]});
  //   }`
  //   : ''
  // }
  // `

  // const htmlCode = `
  // <div class="my-object">
  //   ${ mode === 'animation'
  //     ?
  //   `<div class="gradient">
  //   </div>`
  //     : ''
  //   }
  // </div>
  // `

  return (
    <div className='gradient'>
      <Header />

      <div className='generator'>
        { openPicker && activeId &&
          <ColorPicker
            id={`${activeId.id}`}
            color={activeId.color}
            updateColor={updateColor}
            handleClosePicker={handleClosePicker}
          />
        }
        <section className='setup'>
          <div className='mode'>
            <button
              onClick={() => setMode('gradient')}
              className={`secondary-button ${mode === 'gradient' ? 'secondary-button--active' : ''}`}
            >Gradient</button>

            <button
              onClick={() => setMode('animation')}
              className={`secondary-button ${mode === 'animation' ? 'secondary-button--active' : ''}`}
            >Animation</button>
          </div>

          { mode === 'gradient' &&
            <>
              <div className='setup__head'>
                <ul className='types'>
                  <li>
                    <button
                      className={`
                        type
                        ${type === 'horizontal'
                          ? 'type--active'
                          : ''
                        }
                      `}
                      onClick={() => setType('horizontal')}
                    >
                      <span className='type__icon icon-gradient-horizontal'/>

                      <span className='type__name'>
                        Horizontal
                      </span>
                    </button>
                  </li>

                  <li>
                    <button
                      className={`
                        type
                        ${type === 'vertical'
                          ? 'type--active'
                          : ''
                        }
                      `}
                      onClick={() => setType('vertical')}
                    >
                      <span className='type__icon icon-gradient-vertical'/>

                      <span className='type__name'>
                        Vertical
                      </span>
                    </button>
                  </li>

                  <li>
                    <button
                      className={`
                        type
                        ${type === 'grid'
                          ? 'type--active'
                          : ''
                        }
                      `}
                      onClick={() => setType('grid')}
                    >
                      <span className='type__icon icon-gradient-grid'/>

                      <span className='type__name'>
                        Grid
                      </span>
                    </button>
                  </li>

                  <li>
                    <button
                      className={`
                        type
                        ${type === 'circle'
                          ? 'type--active'
                          : ''
                        }
                      `}
                      onClick={() => setType('circle')}
                    >
                      <span className='type__icon icon-gradient-circle'/>

                      <span className='type__name'>
                        Circle
                      </span>
                    </button>
                  </li>
                </ul>

                <div className='angle'>
                  <AngleInput angle={angle} setAngle={setAngle} />
                  
                  <div className='angle__input'>
                    <label htmlFor='angle'>Angle</label>
                    <input
                      className='angle__number'
                      name='angle'
                      type='number'
                      value={angle}
                      onChange={handleAngleChanged}
                      min={0}
                      max={360}
                    />
                  </div>
                </div>
              </div>

              <div className='edit'>
                <div
                  className='row-color edit__current'
                  style={{
                    background: activeId?.color
                  }}
                ></div>

                <button
                  className='secondary-button'
                  onClick={() => setOpenPicker(true)}
                >Edit</button>

                <button
                  className='secondary-button'
                  onClick={handleRemoveColor}
                >Remove</button>
              </div>

              <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                <div className='re-order'>
                  { firstRow &&
                    <Container
                      items={firstRow.colors as Color[]}
                      id='firstRow'
                    >
                      <>
                        { firstRow.colors.map(color => (
                          <>
                            <Color
                              color={color}
                            />
                          </>
                        ))}

                        { !secondRow &&
                          <button
                            className='row__color row__color--add'
                            onClick={() => handleAddColor('first')}
                          >
                            <span className='icon-plus'/>
                          </button>
                        }
                      </>
                    </Container>
                  }

                  { secondRow &&
                    <Container
                      items={secondRow.colors}
                      id='secondRow'
                    >
                      <>
                        { secondRow.colors.map(color => (
                          <Color
                            color={color}
                          />
                        ))}

                        <button
                          className='row__color row__color--add'
                          onClick={() => handleAddColor('second')}
                        >
                          <span className='icon-plus'/>
                        </button>
                      </>
                    </Container>
                  }
                  <DragOverlay>{activeId ? <Color color={activeId} /> : null}</DragOverlay>
                </div>
              </DndContext>
            </>
          }

          { mode === 'animation' &&
            <>
              <div className=''></div>
            </>
          }
        </section>

        <section className='gradient__view'>
          <div
            className={`view`}
          >
            <div
              className={`view__canvas ${type === 'grid' ? 'view__canvas--grid' : ''}`}
              style={{
                'background': gradient.length !== 0 ? gradient[0] + gradient[1] : '',
                '--grid-background': gridGradient[0] + gridGradient[1],
                
              } as React.CSSProperties}
            ></div>
          </div>

          <div className='slider'>
            { firstRow &&
              <CustomSlider
                row={firstRow}
                setRow={setFirstRow  as React.Dispatch<React.SetStateAction<GradientColor>>}
                background={gradient}
              />
            }

            { secondRow && 
              <CustomSlider
                row={secondRow}
                setRow={setSecondRow as React.Dispatch<React.SetStateAction<GradientColor>>}
                background={gridGradient}
              />
            }
          </div>
        </section>
      </div>

      {/* <section className='css'>
        <div className='css__code'>
          <button
            className={`
              button-dif
              ${codeTech === 'css' ? 'button-dif--active' : ''}
            `}
            onClick={() => setCodeTech('css')}
          >
            <span>
              CSS
            </span>
          </button>
          <button
            className={`
              button-dif
              ${codeTech === 'html' ? 'button-dif--active' : ''}
            `}
            onClick={() => setCodeTech('html')}
          >
            <span>
              HTML
            </span>
          </button>
        </div>

        { codeTech === 'css' &&
          <SyntaxHighlighter
            language="css"
            style={vs2015}
            customStyle={{
              width: '100%',
              height: '250px',
              minHeight: '250px',
              padding: '10px 14px 0px',
              borderRadius: '14px',
              background: '#1A1C23',
              fontSize: '1.4rem',
              overflowX: 'auto',
              overflowY: 'auto'
            }}
          >
            {cssCode}
          </SyntaxHighlighter>
        }

        { codeTech === 'html' &&
          <SyntaxHighlighter
            language="html"
            style={darcula}
            customStyle={{
              width: '100%',
              height: '250px',
              minHeight: '250px',
              padding: '10px 14px 0px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              background: '#1A1C23',
              fontSize: '1.4rem',
              overflowX: 'auto',
              overflowY: 'auto'
            }}
          >
            {htmlCode}
          </SyntaxHighlighter>
        }
      </section> */}
    </div>
  )
}

interface ColorProps {
  color: Color
}

export const Color = ({ color }: ColorProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useSortable({ id: color.id })

  return (
    <div
      className='row__color'
      id={`${color.id}`}
      key={color.id}
      style={{  background: color.color }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
    </div>
  )
}

interface ContainerProps {
  items: Color[]
  id: string,
  children: ReactNode
}

const Container = ({ items, id, children }: ContainerProps) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={rectSortingStrategy}
    >
      <div
        className='row'
        ref={setNodeRef}
      >
        { children }
      </div>
    </SortableContext>
  )
}

interface CustomSliderProps {
  row: GradientColor
  setRow: React.Dispatch<React.SetStateAction<GradientColor>>
  background: string[]
}

interface Positions {
  [key: string]: number
}

const CustomSlider = ({ row, setRow, background }: CustomSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [thumbPosition, setThumbPosition] = useState<Positions>({})

  useEffect(() => {
    const slider = sliderRef.current as HTMLDivElement

    const newPositions: Positions = {}

    row.stops.forEach((stop, index:  keyof string[]) => {
      const color = row.colors[index] as Color
      newPositions[color.color as keyof Positions] = stop / (100 / slider.clientWidth)
    })

    setThumbPosition(newPositions)

  }, [sliderRef, row])

  const handleThumbMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    const initialThumbX = event.clientX

    const slider = sliderRef.current as HTMLDivElement
    
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - initialThumbX
      const newPosition = Math.min(Math.max(0, thumbPosition[id] + offsetX), slider.clientWidth)

      const currentValue = Math.round((100 / slider.clientWidth) * newPosition)
      setThumbPosition(prev => ({
        ...prev,
        [id]: newPosition
      }))

      setRow(prev => {
        let colorIndex = 0
        prev.colors.forEach((color, index) => {
          if (color.color === id) colorIndex = index
        })

        const newStops = prev.stops as number[]
        newStops[colorIndex] = currentValue

        const unorderIndex = isArrayAscending(newStops)
        const newColors = prev.colors as Color[]

        if (unorderIndex !== -1) {
          const changeColor1 = prev.colors[unorderIndex - 1] as Color
          const changeColor2 = prev.colors[unorderIndex] as Color
          newColors[unorderIndex] = changeColor1
          newColors[unorderIndex - 1] = changeColor2

          const changeStop1 = prev.stops[unorderIndex - 1] as number
          const changeStop2 = prev.stops[unorderIndex] as number
          newStops[unorderIndex] = changeStop1
          newStops[unorderIndex - 1] = changeStop2
        }

        return {
          colors: newColors,
          stops: newStops
        }
      })
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('pointermove', handleMouseMove)
      document.removeEventListener('pointerup', handleMouseUp)
    }

    document.addEventListener('pointermove', handleMouseMove)
    document.addEventListener('pointerup', handleMouseUp)
  }

  return (
    <div
      className='custom-slider'
      ref={sliderRef}
      style={{ background: `linear-gradient(${90}deg` + background[1] }}
    >
      { sliderRef && Object.keys(thumbPosition).map(color => (
        <div
          key={color}
          className='custom-slider__thumb'
          onPointerDown={(e) => handleThumbMouseDown(e, color)}
          style={{
            left: `${thumbPosition[color as keyof Positions]}px`,
            background: color
          }}
        ></div>
      ))
      }
    </div>
  )
}