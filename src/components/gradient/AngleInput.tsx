import { useState } from 'react'

import '../../styles/AngleInput.css'

interface AngleInputProps {
  angle: number
  setAngle: React.Dispatch<React.SetStateAction<number>>
}

export const AngleInput = ({ angle, setAngle }: AngleInputProps) => {
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

    setAngle(Math.round(degrees))
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
  
      setAngle(Math.floor(degrees))
    }
  }

  return (
    <div
      className='angle-input'
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}
      onPointerMove={handleMouseMove}
    >
      <div
        className='angle-input__inner'
        style={{
          left: 'calc(50% + 24px * cos(' + angle + 'deg) - 4px)',
          top: 'calc(50% - 24px * sin(' + angle + 'deg) - 4px)',
        }}
      ></div>
    </div>
  )
}
