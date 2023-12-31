/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { extractPalette, rgbToHex } from 'colors-kit'

import { ColorsAction } from '../../reducers/colors'

import { createNewColor } from '../../utils/createNewColor'
import { getMainContrastColor } from '../../utils/getMainContrastColor'

import { DescriptionTooltip } from '../tooltips/DescriptionTooltip'

import '../../styles/ImageCanvas.css'

interface ImageCanvasProps {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  colorsDispatch: React.Dispatch<ColorsAction>
}

export const ImageCanvas = ({ url, setUrl, setErrorMessage, colorsDispatch }: ImageCanvasProps) => {
  const [extract, setExtract] = useState(true)
  const [quantity, setQuantity] = useState(5)
  const [isDragging, setIsDragging] = useState(false)
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })
  const [pickerColor, setPickerColor] = useState('')
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [pickerActive, setPickerActive] = useState(false)
  const imageRef = useRef<HTMLCanvasElement>(null)
  const circleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    async function extractColors() {
      try {
        const rgbColors = await extractPalette(url, quantity)
        const hexColors = rgbColors.map(color => rgbToHex(color))
        setExtractedColors(hexColors)
      } catch (error) {
        setUrl('')
        setErrorMessage('Cannot access the URL, try dragging the image.')
      }
    }

    if (imageRef.current !== null) {
      const canvas = imageRef.current as HTMLCanvasElement
      const context = canvas.getContext('2d') as CanvasRenderingContext2D

      const img = new Image()
      img.src = url
      img.onload = () => {
        const ratio = 380 / img.height
        const newWidth = img.width * ratio

        canvas.width = newWidth
        canvas.height = 380
        context?.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      extractColors()
    }
  }, [url, extract])

  useEffect(() => {
    if (url !== '') {
    const canvas = imageRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const imageData = ctx.getImageData(coordinates.x + 15, coordinates.y + 15, 1, 1).data

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

  function handleQuantitySubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setExtract(!extract)
  }

  const handleStartDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (pickerActive) {
      moveCircleToCurrentLocation(event)
      setIsDragging(true)
    }
  }

  const handleMoveDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      moveCircleToCurrentLocation(event)
    }
  }

  const handleEndDrag = () => {
    setIsDragging(false)
  }

  function moveCircleToCurrentLocation(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = circleRef.current as HTMLElement
    const parent = target.parentElement as HTMLElement
    const containerRect = parent.getBoundingClientRect()
    
    const newX = event.clientX - containerRect.left - target.clientWidth / 2
    const newY = event.clientY - containerRect.top - target.clientHeight / 2

    const x = Math.round(Math.max(-target.clientWidth / 2, Math.min(newX, containerRect.width - target.clientWidth / 2)))
    const y = Math.round(Math.max(-target.clientHeight / 2, Math.min(newY, containerRect.height - target.clientHeight / 2)))

    setCoordinates({ x, y })
  }

  function handlePickColor() {
      const newColors = Array.from(extractedColors)
      newColors.push('#000000')
      setExtractedColors(newColors)
  }

  function handleAddColorsToPalette() {
    const newColors = extractedColors.map(color => {
      return createNewColor(color, 'hex')
    })

    colorsDispatch({ type: 'replace-colors', payload: { colors: newColors } })
  }

  return (
    <>
      { extractedColors.length === 0 &&
        <p className='loading'
        >LOADING...</p>
      }
      <div className='Image-Canvas'
        style={{
          display: extractedColors.length === 0 ? 'none' : 'flex'
        }}
      >

        <div
          className='canvas'
          onMouseDown={handleStartDrag}
          onMouseMove={handleMoveDrag}
          onMouseUp={handleEndDrag}
        >
          <canvas
            className='canvas__image'
            ref={imageRef}
            onDragStart={(event) => {event.preventDefault()}}
          />
          { pickerActive &&
            <button
              className='canvas__thumb'
              ref={circleRef}
              style={{
                left: `${coordinates.x}px`,
                top: `${coordinates.y}px`,
                backgroundColor: pickerColor,
              }}
            ></button>
          }
        </div>

        <div className='extracted-colors'>
          { extractedColors.length !== 0 &&
            extractedColors.map(color => (
              <button
                className='extracted-colors__color'
                key={color}
                style={{
                  background: color
                }}
              >
                <p
                  className='extracted-colors__name'
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

        <div className='config'>
          <button
            className={`
              config__button
              ${pickerActive ? 'config__button--active' : ''}
            `}
            onClick={() => setPickerActive(!pickerActive)}
            data-tooltip
          >
            <span className='icon icon-eye-dropper' />
            <DescriptionTooltip text='Add Color' tipPosition='bottom'/>
          </button>

          <button
            className='config__button'
            onClick={handleAddColorsToPalette}
            data-tooltip
          >
            <span className='icon icon-palette' />
            <DescriptionTooltip text='Add Palette' tipPosition='bottom'/>
          </button>

          <button
            className='config__button'
            onClick={handleQuantitySubmit}
            data-tooltip
          >
            <span className='icon icon-spin' />
            <DescriptionTooltip text='Extract again' tipPosition='bottom'/>
          </button>

          <form className='extractor-input' onSubmit={handleQuantitySubmit}>
            <label htmlFor='quantity' className='quantity-label'>
              Quantity:
            </label>

            <input type='number' id='quantity' value={quantity} onChange={handleQuantityChange} />
          </form>
        </div>
      </div>
    </>
  )
}
