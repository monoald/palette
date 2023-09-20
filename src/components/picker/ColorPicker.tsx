import React, { useEffect, useRef, useState } from 'react'
import { AnyFormat, BaseColor, Rgb, colorFormatConverter, rgbToHsv } from 'colors-kit'

import { drawColorCanvas } from '../../utils/drawColorCanvas'
import { findColorCoordinates } from '../../utils/findColorCoordinates'

import { Select } from '../Select'
import { DraggableModal } from '../../containers/DraggableModal'
import { HexadecimalPicker } from './pickers/HexadecimalPicker'
import { CmykPicker } from './pickers/CmykPicker'
import { HsbPicker } from './pickers/HsbPicker'
import { HslPicker } from './pickers/HslPicker'
import { LabPicker } from './pickers/LabPicker'
import { RgbPicker } from './pickers/RgbPicker'
import { XyzPicker } from './pickers/XyzPicker'

import '../../styles/NewPicker.css'
import '../../styles/Canvas.css'
import { Formats } from '../../pages/PaletteGenerator'


interface ColorPickerProps {
  id: string
  color: string
  updateColor: (color: PickerColor, type?: string) => void
  handleClosePicker: () => void
  type?: string
}

export interface PickerColor {
  id: string
  formats: Formats
}

interface Coordinates {
  x: number
  y: number
  mouseMoved: boolean
}

const formatSelectData = {
  'Hexadecimal': null,
  'CMYK': null,
  'HSB': null,
  'HSL': null,
  'RGB': null,
  'LAB': null,
  'XYZ': null,
}

export const ColorPicker = ({ id, color, updateColor, handleClosePicker, type }: ColorPickerProps) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [pickerFormat, setPickerFormat] = useState('Hexadecimal')
  const [firstRender, setFirstRender] = useState(true)
  
  const [pickerColor, setPickerColor] = useState<PickerColor>({
    id,
    formats: colorFormatConverter(color, {
      identifyFormat: true,
      allFormats: true,
    }) as Formats
  })

  const colorCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false)
    } else {
      updateColor(pickerColor, type)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerColor])

  const updateWorkingColor = (color: AnyFormat, format: string) => {
    const formats = colorFormatConverter(color as BaseColor, {
      currentFormat: format,
      allFormats: true,
    }) as Formats

    setPickerColor({
      id,
      formats
    })
  }

  return (
    <DraggableModal nameClass='color-picker'>
        <div className='color-picker__header'>
          <Select
            options={formatSelectData}
            value={pickerFormat}
            setValue={setPickerFormat}
            configuration={{
              showCurrentValue: true,
              showIcon: false
            }}
          />

          <button
            className='close-button'
            onClick={handleClosePicker}
          >
            <span className='close-button__icon icon-x'/>
          </button>
        </div>

        <div className='color-picker__pickers'>
          <PickerContainer
              color={pickerColor}
              updateColor={updateWorkingColor}
            >
              { pickerFormat === 'Hexadecimal'
                ? <HexadecimalPicker />
                : <></>
              }
              <></>

              { pickerFormat === 'CMYK'
                ? <CmykPicker />
                : <></>
              }

              { pickerFormat === 'HSB'
                ? <HsbPicker />
                : <></>
              }

              { pickerFormat === 'HSL'
                ? <HslPicker />
                : <></>
              }

              { pickerFormat === 'LAB'
                ? <LabPicker />
                : <></>
              }

              { pickerFormat === 'RGB'
                ? <RgbPicker />
                : <></>
              }

              { pickerFormat === 'XYZ'
                ? <XyzPicker />
                : <></>
              }
            </PickerContainer>
        </div>

      <Canvas
        canvasRef={colorCanvasRef}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        color={pickerColor}
        updateColor={updateWorkingColor}
      />
    </DraggableModal>
  )
}

interface PickerContanerProps {
  color: PickerColor
  updateColor: (color: AnyFormat, format: string, moveThumb: boolean) => void
  children: JSX.Element[]
}

export const PickerContainer = ({ color, updateColor, children }: PickerContanerProps) => {
  return (
    <>
      {React.Children.map(children, child => {
          return React.cloneElement(child, { color, updateColor })
      })}
    </>
  )
}

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  coordinates: Coordinates | null
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates | null>>
  color: PickerColor,
  updateColor: (color: AnyFormat, format: string) => void
}

const Canvas = ({ canvasRef, coordinates, setCoordinates, color, updateColor }: CanvasProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const circleRef = useRef<HTMLButtonElement>(null)
  
  // Update PickerColor when mouse moved
  useEffect(() => {
    if (coordinates !== null && coordinates.mouseMoved) {
      const canvas = canvasRef.current as HTMLCanvasElement
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const imageData = ctx.getImageData(coordinates.x + 14, coordinates.y + 14, 1, 1).data
      const hsbColor = rgbToHsv({ r: imageData[0], g: imageData[1], b: imageData[2] })
  
      updateColor({ h: color.formats.hsv?.h as number, s: hsbColor.s, v: hsbColor.v}, 'hsv')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates])
  
  const handleStartDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    moveCircleToCurrentLocation(event)
    setIsDragging(true)
  }

  const handleMoveDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      moveCircleToCurrentLocation(event)
    }
  }

  const handleEndDrag = () => {
    setIsDragging(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLElement
    const parent = target.parentElement as HTMLElement
    const step = 1
    const containerRect = parent.getBoundingClientRect()

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault()

      const newCoordinates = { ...coordinates } as Coordinates
      switch (event.key) {
        case 'ArrowUp':
          newCoordinates.y -= step
          break
        case 'ArrowDown':
          newCoordinates.y += step
          break
        case 'ArrowLeft':
          newCoordinates.x -= step
          break
        case 'ArrowRight':
          newCoordinates.x += step
          break
        default:
          break
      }

      newCoordinates.x = Math.max(-target.clientWidth / 2, Math.min(newCoordinates.x, containerRect.width - target.clientWidth / 2))
      newCoordinates.y = Math.max(-target.clientHeight / 2, Math.min(newCoordinates.y, containerRect.height - target.clientHeight / 2))

      setCoordinates(newCoordinates)
    }
  }

  function moveCircleToCurrentLocation(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = circleRef.current as HTMLElement
    const parent = target.parentElement as HTMLElement
    const containerRect = parent.getBoundingClientRect()
    
    const newX = event.clientX - containerRect.left - target.clientWidth / 2
    const newY = event.clientY - containerRect.top - target.clientHeight / 2

    const x = Math.max(-target.clientWidth / 2, Math.min(newX, containerRect.width - target.clientWidth / 2))
    const y = Math.max(-target.clientHeight / 2, Math.min(newY, containerRect.height - target.clientHeight / 2))
    
    setCoordinates({ x, y, mouseMoved: true })
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    drawColorCanvas(canvas, color.formats.hsv?.h as number)

    const { x, y } = findColorCoordinates(canvas, color.formats.rgb as Rgb)

    setCoordinates({ x: x - 14, y: y - 14, mouseMoved: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color])

  return (
    <div
      className='Canvas'
      onMouseDown={handleStartDrag}
      onMouseMove={handleMoveDrag}
      onMouseUp={handleEndDrag}
    >
      <canvas
        className='Canvas__draw'
        width={240}
        height={240}
        ref={canvasRef}
      />

      { coordinates &&
        <button
          className='Canvas__thumb'
          style={{
            left: `${coordinates.x}px`,
            top: `${coordinates.y}px`,
          }}
          onKeyDown={handleKeyDown}
          ref={circleRef}
        >
          <div
          className='Canvas__thumb-bg'
            style={{
              background: color.formats.hex,
            }}
          >
          </div>
        </button>
      }
    </div>
  )
}
