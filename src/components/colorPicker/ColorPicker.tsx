/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { AnyFormat } from '../../lib/types';
import { findColorCoordinates } from '../../utils/findColorCoordinates';
import { drawColorCanvas } from '../../utils/drawColorCanvas';

import { CmykPicker, HexadecimalPicker, HsbPicker, HslPicker, LabPicker, PickerContainer, RgbPicker, XyzPicker } from '../Pickers';
import { Select } from '../Select';
import { Canvas } from './Canvas';
import { CloseModalButton } from '../CloseModalButton';
import { Color } from '../../pages/PaletteGenerator';

import { ColorsAction, ColorsTypes } from '../../reducers/colors';
import { ModalsAction } from '../../reducers/modals';

import '../../styles/ColorPicker.css'

interface ColorPickerProps {
  color: Color
  colorsDispatch: React.Dispatch<ColorsAction>
  modalsDispatch: React.Dispatch<ModalsAction>
  type: string
}

interface Coordinates {
  x: number
  y: number
  mouseMoved: boolean
}

const formatSelectData = ['HEXADECIMAL', 'CMYK', 'HSB', 'HSL', 'LAB', 'RGB', 'XYZ']

export const ColorPicker = ({ color, colorsDispatch, modalsDispatch, type }: ColorPickerProps) => {
  const [pickerFormat, setPickerFormat] = useState('HEXADECIMAL');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [moveThumb, setMoveThumb] = useState(true)
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update Color Canvas
  useEffect(() => {
    const canvas = colorCanvasRef.current as HTMLCanvasElement;
    drawColorCanvas(canvas, color.formats.hsb.h)

    if (moveThumb) {
      const canvas = colorCanvasRef.current as HTMLCanvasElement;
      const { x, y } = findColorCoordinates(canvas, color.formats.rgb)

      setCoordinates({ x: x - 14, y: y - 14, mouseMoved: false })
    }
  }, [color])

  function updateColor(color: AnyFormat, format: string, moveThumb: boolean) {
    colorsDispatch({ type: type as ColorsTypes, payload: { color, format } })
    setMoveThumb(moveThumb)
  }

  return (
    <dialog
      open
      className='Color-Picker'
    >
      <Canvas
        canvasRef={colorCanvasRef}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        color={color}
        updateColor={updateColor}
      />

      <div className='format-container' >
        <Select
          options={formatSelectData}
          value={pickerFormat}
          setValue={setPickerFormat}
          configuration={{
            showCurrentValue: true,
            showIcon: true
          }}
        />
        <div className='format-modifiers' >
          <PickerContainer
            color={color}
            updateColor={updateColor}
          >
            { pickerFormat === 'HEXADECIMAL'
              ? <HexadecimalPicker />
              : <></>
            }

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
        <CloseModalButton modalsDispatch={modalsDispatch} type='picker' />
      </div>
    </dialog>
  );
};