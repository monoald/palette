import React, { useEffect, useRef, useState } from 'react'
import { AnyFormat, Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from '../../lib/types';
import { rgbToHsv } from '../../lib';
import '../../styles/Canvas.css'
import { Color } from '../../pages/PaletteGenerator';

interface Coordinates {
  x: number
  y: number
  mouseMoved: boolean
}

interface Formats {
  cmyk: Cmyk
  hsb: Hsv
  hsl: Hsl
  lab: Lab
  rgb: Rgb
  xyz: Xyz
}

export interface ContrastColor {
  color: string
  primaryColorContrast: string
  id: number
  formats: Formats
}


interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  coordinates: Coordinates | null
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates | null>>
  color: Color,
  updateColor: (color: AnyFormat, format: string, moveThumb: boolean) => void
}

export const Canvas = ({ canvasRef, coordinates, setCoordinates, color, updateColor }: CanvasProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null)
  
  // Update Color hen mouse moved
  useEffect(() => {
    if (coordinates !== null && coordinates.mouseMoved) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const imageData = ctx.getImageData(coordinates.x + 14, coordinates.y + 14, 1, 1).data;
      const hsbColor = rgbToHsv({ r: imageData[0], g: imageData[1], b: imageData[2] })
  
      updateColor({ h: color.formats.hsb.h, s: hsbColor.s, v: hsbColor.v}, 'hsb', false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates])
  
  const handleStartDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    moveCircleToCurrentLocation(event)
    setIsDragging(true);
  };

  const handleMoveDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      moveCircleToCurrentLocation(event)
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const parent = target.parentElement as HTMLElement
    const step = 1;
    const containerRect = parent.getBoundingClientRect();

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();

      const newCoordinates = { ...coordinates } as Coordinates;
      switch (event.key) {
        case 'ArrowUp':
          newCoordinates.y -= step;
          break;
        case 'ArrowDown':
          newCoordinates.y += step;
          break;
        case 'ArrowLeft':
          newCoordinates.x -= step;
          break;
        case 'ArrowRight':
          newCoordinates.x += step;
          break;
        default:
          break;
      }

      newCoordinates.x = Math.max(-target.clientWidth / 2, Math.min(newCoordinates.x, containerRect.width - target.clientWidth / 2));
      newCoordinates.y = Math.max(-target.clientHeight / 2, Math.min(newCoordinates.y, containerRect.height - target.clientHeight / 2));

      setCoordinates(newCoordinates)
    }
  };

  function moveCircleToCurrentLocation(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = circleRef.current as HTMLElement
    const parent = target.parentElement as HTMLElement
    const containerRect = parent.getBoundingClientRect();
    
    const newX = event.clientX - containerRect.left - target.clientWidth / 2;
    const newY = event.clientY - containerRect.top - target.clientHeight / 2;

    const x = Math.max(-target.clientWidth / 2, Math.min(newX, containerRect.width - target.clientWidth / 2));
    const y = Math.max(-target.clientHeight / 2, Math.min(newY, containerRect.height - target.clientHeight / 2));
    
    setCoordinates({ x, y, mouseMoved: true });
  }

  return (
    <div
      className='canvas-container'
      onMouseDown={handleStartDrag}
      onMouseMove={handleMoveDrag}
      onMouseUp={handleEndDrag}
    >
      <canvas
        className='color-canvas'
        width={240}
        height={240}
        ref={canvasRef}
      />

      { coordinates &&
        <div
          className="thumb"
          style={{
            left: `${coordinates.x}px`,
            top: `${coordinates.y}px`,
          }}
          onKeyDown={handleKeyDown}
          ref={circleRef}
        >
          <div
          className='thumb-center'
            style={{
              background: color.color,
            }}
          >
          </div>
        </div>
      }
    </div>
  )
}
