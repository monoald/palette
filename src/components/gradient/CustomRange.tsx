import { useEffect, useRef, useState } from 'react'
import { Color, GradientColor, GradientType } from '../../pages/Gradient'
import { isArrayAscending } from '../../utils/isArrayAscending'

interface CustomSliderProps {
  row: GradientColor
  setGradient: React.Dispatch<React.SetStateAction<GradientType>>
  rowName: keyof GradientType
  background: string[]
}

interface Positions {
  [key: string]: number
}

export const CustomRange = ({ row, rowName, setGradient, background }: CustomSliderProps) => {
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

      setGradient(prev => {
        const newRow = { ...row }
        let colorIndex = 0
        newRow.colors.forEach((color, index) => {
          if (color.color === id) colorIndex = index
        })

        const newStops = newRow.stops as number[]
        newStops[colorIndex] = currentValue

        const unorderIndex = isArrayAscending(newStops)
        const newColors = newRow.colors as Color[]

        if (unorderIndex !== -1) {
          const changeColor1 = newRow.colors[unorderIndex - 1] as Color
          const changeColor2 = newRow.colors[unorderIndex] as Color
          newColors[unorderIndex] = changeColor1
          newColors[unorderIndex - 1] = changeColor2

          const changeStop1 = newRow.stops[unorderIndex - 1] as number
          const changeStop2 = newRow.stops[unorderIndex] as number
          newStops[unorderIndex] = changeStop1
          newStops[unorderIndex - 1] = changeStop2
        }

        return {
          ...prev,
          [rowName]: { colors: newColors, stops: newStops }
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