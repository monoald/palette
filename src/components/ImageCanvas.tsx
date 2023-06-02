/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { extractColorPalette } from '../lib/fromImage/getColorPaletteFromImg'
import { rgbToHex } from '../lib'
import '../styles/ImageCanvas.css'
import { createNewColor } from '../utils/createNewColor'
import { Color } from '../pages/PaletteGenerator'
import { getMainContrastColor } from '../utils/getMainContrastColor'

interface ImageCanvasProps {
  url: string
  setColors: React.Dispatch<React.SetStateAction<Color[]>>
}

export const ImageCanvas = ({ url, setColors }: ImageCanvasProps) => {
  const [extract, setExtract] = useState(true)
  const [quantity, setQuantity] = useState(5)
  const [isDragging, setIsDragging] = useState(false)
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })
  const [pickerColor, setPickerColor] = useState('')
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [pickerActive, setPickerActive] = useState(false)
  const imageRef = useRef<HTMLCanvasElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function extractColors() {
      const rgbColors = await extractColorPalette(url, quantity)
      const hexColors = rgbColors.map(color => rgbToHex(color))
      console.log(hexColors);
      setExtractedColors(hexColors)
    }

    if (imageRef.current !== null) {
      const canvas = imageRef.current as HTMLCanvasElement
      const context = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D

      const img = new Image()
      img.src = url
      img.crossOrigin = "anonymous"
      img.onload = () => {
        context?.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      extractColors()
    }
  }, [url, extract])

  useEffect(() => {
    if (url !== '') {
    const canvas = imageRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const imageData = ctx.getImageData(coordinates.x + 15, coordinates.y + 15, 1, 1).data;

    const colorHex = rgbToHex({ r: imageData[0], g: imageData[1], b: imageData[2] })

    setPickerColor(colorHex)

    setExtractedColors(colors => {
      colors[colors.length - 1] = colorHex
      return colors
    })
    }
  }, [coordinates])

  useEffect(() => {
    if (pickerActive) {
      handlePickColor()
    }
  }, [pickerActive])

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuantity(+event.target.value)
  }

  function handleQuantitySubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    setExtract(!extract)
  }

  const handleStartDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (pickerActive) {
      moveCircleToCurrentLocation(event)
      setIsDragging(true);
    }
  };

  const handleMoveDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      moveCircleToCurrentLocation(event)
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  function moveCircleToCurrentLocation(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = circleRef.current as HTMLElement
    const parent = target.parentElement as HTMLElement
    const containerRect = parent.getBoundingClientRect();
    
    const newX = event.clientX - containerRect.left - target.clientWidth / 2;
    const newY = event.clientY - containerRect.top - target.clientHeight / 2;

    const x = Math.round(Math.max(-target.clientWidth / 2, Math.min(newX, containerRect.width - target.clientWidth / 2)));
    const y = Math.round(Math.max(-target.clientHeight / 2, Math.min(newY, containerRect.height - target.clientHeight / 2)));

    setCoordinates({ x, y });
  }

  function handlePickColor() {
      const newColors = Array.from(extractedColors)
      newColors.push('#000000')
      setExtractedColors(newColors)
  }

  function handleAddColorsToPalette() {
    const newColors = extractedColors.map(color => {
      return createNewColor(color)
    })

    setColors(newColors)
  }

  return (
    <>
      { extractedColors.length === 0 &&
        <p
          style={{
            fontSize: '3.4rem',
            letterSpacing: '5px',
            margin: '100p auto'
          }}
        >LOADING...</p>
      }
      <div className='Image-Canvas'
        style={{
          display: extractedColors.length === 0 ? 'none' : 'flex'
        }}
      >
        
        <div className='colors-container'>
          { extractedColors.length !== 0 &&
            extractedColors.map(color => (
              <button
                className='color'
                key={color}
                style={{
                  background: color
                }}
              >
                <p
                  style={{
                    color: getMainContrastColor(color)
                  }}
                >
                  {color}
                </p>
              </button>
            ))
          }
        </div>

        <div
          className='canvas-container'
          onMouseDown={handleStartDrag}
          onMouseMove={handleMoveDrag}
          onMouseUp={handleEndDrag}
        >
          <canvas
            className='image'
            width={560}
            height={400}
            ref={imageRef}
            onDragStart={(event) => {event.preventDefault()}}
          />
          { pickerActive &&
            <span
              className='icon'
              ref={circleRef}
              style={{
                left: `${coordinates.x}px`,
                top: `${coordinates.y}px`,
                backgroundColor: pickerColor,
              }}
            />
          }
        </div>

        <div className='config-container'>
          <button
            className={`config-button${pickerActive ? ' config-button--active' : ''}`}
            onClick={() => setPickerActive(!pickerActive)}
          >
            <span className='icon icon-eye-dropper' />
            <p>PICK COLOR</p>
          </button>

          <button
            className='config-button'
            onClick={handleQuantitySubmit}
          >
            <span className='icon icon-palette' />
            <p>EXTRACT</p>
          </button>

          <button
            className='config-button'
            onClick={handleAddColorsToPalette}
          >
            <span className='icon icon-plus' />
            <p>ADD PALETTE</p>
          </button>

          <form className='extractor-input'>
            <label htmlFor="quantity" className='quantity-label'>COLORS:</label>
            <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} />
          </form>
        </div>
      </div>
    </>
  )
}
