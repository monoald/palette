/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import '../styles/ColorPicker.css'
import { Modal } from './Modal';
import { hexToRgb, rgbToHex } from '../lib';
import { DraggableCircle } from './DraggableCircle';
import { drawColorCanvas } from '../utils/drawColorCanvas';
import { findColorCoordinates } from '../utils/findColorCoordinates';
import { getMainContrastColor } from '../utils/getMainContrastColor';


interface ColorPickerProps {
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>
  color: string
  setColor: React.Dispatch<React.SetStateAction<ContrastColor>>
  hue: number
}

interface ContrastColor {
  color: string
  primaryColorContrast: string
  id: number
}

interface Coordinates {
  x: number
  y: number
}

export const ColorPicker = ({ setOpenColorPicker, color, setColor, hue }: ColorPickerProps) => {
  const [firstRender, setFirstRender] = useState(true);
  const [baseHue, setBaseHue] = useState<number>(hue)
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);


  // Update Color Canvas
  useEffect(() => {
    const canvas = colorCanvasRef.current as HTMLCanvasElement;

    drawColorCanvas(canvas, baseHue)
  }, [baseHue])

  // Move Circle to current color
  useEffect(() => {
    const canvas = colorCanvasRef.current as HTMLCanvasElement;
    const targetColor = hexToRgb(color)
    const { x, y } = findColorCoordinates(canvas, targetColor)

    setCoordinates({ x: x - 14, y: y - 14 })
  }, [])

  // Update selected color
  useEffect(() => {
    if (coordinates !== null) {
      
      if (firstRender) {
        setFirstRender(false)
        return
      }
      const canvas = colorCanvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

      const imageData = ctx.getImageData(coordinates.x + 14, coordinates.y + 14 , 1, 1);
      const [red, green, blue] = imageData.data;
      const colorHex = rgbToHex({ r: red, g: green, b: blue});
      const mainContrastColor = getMainContrastColor(colorHex)

      setColor((clr: ContrastColor) => ({ color: colorHex, id: clr.id, primaryColorContrast: mainContrastColor }))
    }
  }, [coordinates, baseHue])
  

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBaseHue(+event.target.value)
  }

  return (
    <Modal setModal={setOpenColorPicker} backgroundOpacity={0}>
        <dialog
          open
          className='Color-Picker'
          style={{
            width: 280,
            height: 400,
            padding: 20,
            border: 'none',
            borderRadius: '18px',
            alignSelf: 'center',
            background: 'rgb(26, 27, 37)',
            boxShadow:  `20px 20px 30px #08090C`
          }}
        >
          <div
            className='container'
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div
              className='canvas-continer'
              style={{
                position: 'relative',
                width: '239px',
                height: '240px',
              }}
            >
              <canvas
                width="240px"
                height="240px"
                id="color_canvas"
                ref={colorCanvasRef}
                className='color-canvas'
                style={{
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
              />
              { coordinates &&
                <DraggableCircle
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                  currentColor={color}
                />
              }
            </div>
            <input
              className='hue-slider'
              type="range"
              min={0}
              max={360}
              value={baseHue}
              onChange={handleChange}
              style={{
                width: '240px',
                height: '9px',
                border: 'none',
                borderRadius: 10,
                appearance: 'none',
                background: '-webkit-linear-gradient(left, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))',
              }}
            />
          </div>

          <div className='format'>

          </div>
        </dialog>
    </Modal>
  );
};





