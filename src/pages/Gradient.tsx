import { useEffect, useRef, useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, Over, UniqueIdentifier, closestCorners, useDroppable } from '@dnd-kit/core'
import { SortableContext, arrayMove,  rectSortingStrategy, useSortable } from '@dnd-kit/sortable'

import { getStops } from '../utils/getStops'

import { DescriptionTooltip } from '../components/tooltips/DescriptionTooltip'
import { AngleInput } from '../components/gradient/AngleInput'

import '../styles/Gradient.css'
import { isArrayAscending } from '../utils/isArrayAscending'

interface GradientColor {
  colors: string[]
  stops: number[]
}

interface GradientColors {
  firstRow: GradientColor
  secondRow?: GradientColor
}

function makeGradient(container: GradientColor) {
  let basicGradient = ''
  container.colors.map((color, index) => {
    basicGradient += `, ${color} ${container.stops[index]}%`
  })

  return basicGradient
}

export const Gradient = () => {
  const [type, setType] = useState('horizontal')
  const [angle, setAngle] = useState(90)
  const [activeId, setActiveId] = useState<UniqueIdentifier>()
  const [firstRow, setFirstRow] = useState<GradientColor>({
    colors: ['#294eb8', '#d2395c', '#a9d237', '#37d2ae', '#6137d2'],
    stops: [0, 25, 50, 75, 100]
  })
  const [secondRow, setSecondRow] = useState<GradientColor>()
  const [gradient, setGradient] = useState([
    `linear-gradient(${angle}deg`,
    `${makeGradient(firstRow)})`
  ])
  const [gridGradient, setGridGradient] = useState(['',''])


  useEffect(() => {
    // Change colors and stops
    if (
      (type === 'vertical' || type === 'horizontal' || type === 'circle')
      && secondRow
    ) {
      setFirstRow(prev => {
        const newColors = [ ...prev.colors, ...secondRow.colors as string[]]

        const newStops = getStops(100 / (newColors.length - 1))

        return {
          colors: newColors,
          stops: newStops,
        }
      })

      setSecondRow(undefined)
    } else if (type === 'grid' && !secondRow){
      setFirstRow(prev => {
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
      })
    }

    const newAngle = type === 'vertical' ? 0 : 90
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
  }, [secondRow, type])

  useEffect(() => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angle])

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e
    const { id } = active

    setActiveId(id)
  }

  const findContainer = (id: UniqueIdentifier) => {
    if (id === 'firsRow' || id === 'secondRow') return id

    if (firstRow.colors.includes(id as string)) return 'firstRow'

    if (secondRow?.colors.includes(id as string)) return 'secondRow'
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

    if (secondRow) {
      const activeColors = activeContainer === 'firstRow' ? [...firstRow.colors] : [...secondRow.colors]
      const overColors = overContainer === 'secondRow' ? [...secondRow.colors] : [...firstRow.colors]
      
      const activeIndex = activeColors.indexOf(id as string)
      const overIndex = overColors.indexOf(overId as string)
      
      console.log(activeColors, activeIndex);
      console.log(overColors, overIndex);
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
        const activeIndex = prev.colors.indexOf(id as string)
        const overIndex = prev.colors.indexOf(overId as string)

        const newColors = arrayMove(prev.colors, activeIndex, overIndex)
        
        return {
          ...prev,
          colors: newColors
        }
      })
    } else if (activeContainer === 'secondRow' && overContainer === 'secondRow') {
      setSecondRow(prev => {
        if (prev) {
          const activeIndex = prev.colors.indexOf(id as string)
          const overIndex = prev.colors.indexOf(overId as string)
  
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

  return (
    <div className='gradient'>
      <section className='gradient__setup'>
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className='gradient__re-order'>
            <Container
              items={firstRow.colors}
              type={type}
              id='firstRow'
            />

            { secondRow &&
              <Container
                items={secondRow.colors as string[]}
                type={type}
                id='secondRoe'
              />
            }
            <DragOverlay>{activeId ? <Color color={activeId as string} /> : null}</DragOverlay>
          </div>
        </DndContext>
        <div className='setup__section types'>
          <ul className='setup__types'>
            <li>
              <button
                className={`
                  type
                  txt-hover-primary
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
                  txt-hover-primary
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
                  txt-hover-primary
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
                  txt-hover-primary
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
        </div>
        
        <div className='setup__section angle'>
          <div className='angle-container'>
            <AngleInput angle={angle} setAngle={setAngle} />
            
            <div className='angle-input-container'>
              <label htmlFor="angle">Angle</label>
              <input
                className='angle-number'
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
      </section>

      <div className='slider'>
        {/* <div className='custom-input__thumb'></div> */}
        <CustomSlider
          row={firstRow}
          setRow={setFirstRow}
          background={gradient}
        />

        { secondRow && 
          <CustomSlider
            row={secondRow}
            setRow={setSecondRow as React.Dispatch<React.SetStateAction<GradientColor>>}
            background={gridGradient}
          />
        }
      </div>

      <div
        className={`gradient__view ${type === 'grid' ? 'gradient__view--grid' : ''}`}
        style={{
          background: gradient[0] + gradient[1],
          '--grid-background': gridGradient[0] + gridGradient[1],
        } as React.CSSProperties}
      >
      </div>
    </div>
  )
}

interface ColorProps {
  color: string
}

export const Color = ({ color }: ColorProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useSortable({ id: color })

  return (
    <div
      className='color-grad'
      id={color}
      key={color}
      style={{  background: color }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    ></div>
  )
}

interface ContainerProps {
  items: string[]
  type: string
  id: string
}

const Container = ({ items, type, id }: ContainerProps) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={rectSortingStrategy}
    >
      <div
        className={`colors-container colors-container--${type}`}
        ref={setNodeRef}
      >
        { items.map(color => (
          <Color
            color={color}
          />
        ))
        }
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
      newPositions[row.colors[index] as keyof Positions] = stop / (100 / slider.clientWidth)
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
        const index = prev.colors.indexOf(id) as number

        const newStops = prev.stops as number[]
        newStops[index] = currentValue

        const unorderIndex = isArrayAscending(newStops)
        const newColors = prev.colors as string[]

        if (unorderIndex !== -1) {
          const changeColor1 = prev.colors[unorderIndex - 1] as string
          const changeColor2 = prev.colors[unorderIndex] as string
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
      style={{ background: background[0] + background[1] }}
    >
      { sliderRef && Object.keys(thumbPosition).map(color => (
        <div
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