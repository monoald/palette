import { useState } from "react"
import { GradientType } from "../../pages/Gradient"

import '../../styles/AngleInput.css'

interface AngleInputProps {
  angle: number
  setGradient: React.Dispatch<React.SetStateAction<GradientType>>
}

export const AngleInput = ({ angle, setGradient }: AngleInputProps) => {
  const [isClicked, setIsClicked] = useState(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsClicked(true)

    const circle = e.target as HTMLElement
    const rect = circle.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX
    const mouseY = e.clientY

    const deltaX = mouseX - centerX
    const deltaY = centerY - mouseY

    const radians = Math.atan2(deltaY, deltaX)
    let degrees = radians * (180 / Math.PI)
    
    if (degrees < 0) {
      degrees += 360
    }

    degrees = Math.abs(degrees - 450)
    degrees = degrees > 360 ? Math.abs(degrees - 360) : degrees

    setGradient(prev => ({ ...prev, angle: Math.round(degrees) }))
  }

  const handleMouseUp = () => {
    setIsClicked(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isClicked) {
      const circle = e.target as HTMLElement
      const rect = circle.getBoundingClientRect()
  
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
  
      const mouseX = e.clientX
      const mouseY = e.clientY
  
      const deltaX = mouseX - centerX
      const deltaY = centerY - mouseY
  
      const radians = Math.atan2(deltaY, deltaX)
      let degrees = radians * (180 / Math.PI)
      
      if (degrees < 0) {
        degrees += 360
      }

      degrees = Math.abs(degrees - 450)
      degrees = degrees > 360 ? Math.abs(degrees - 360) : degrees
  
      setGradient(prev => ({ ...prev, angle: Math.floor(degrees) }))
    }
  }

  const handleAngleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setGradient(prev => ({ ...prev, angle: +target.value }))
  }

  return (
    <div className='angle'>
      <div
        className='angle-input'
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
        onPointerMove={handleMouseMove}
      >
        <div
          className='angle-input__inner'
          style={{
            left: 'calc(50% + 24px * cos(' + Math.abs(angle - 450) + 'deg) - 4px)',
            top: 'calc(50% - 24px * sin(' + Math.abs(angle - 450) + 'deg) - 4px)',
          }}
        ></div>
      </div>

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
  )
}
