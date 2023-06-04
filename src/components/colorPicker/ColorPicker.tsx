/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { AnyFormat } from '../../lib/types';
import { Modal } from '../Modal';
import { Select } from '../Select';
import { CmykPicker, HexadecimalPicker, HsbPicker, HslPicker, PickerContainer, RgbPicker } from '../Pickers';
import { drawColorCanvas } from '../../utils/drawColorCanvas';
import { findColorCoordinates } from '../../utils/findColorCoordinates';
import '../../styles/ColorPicker.css'
import { Canvas } from './Canvas';
import { Color } from '../../pages/PaletteGenerator';
import { CloseModalButton } from '../CloseModalButton';
import { LabPicker } from '../Pickers/LabPicker';
import { XyzPicker } from '../Pickers/XyzPicker';
import { ColorsAction, ColorsTypes } from '../../reducers/colors';

interface ColorPickerProps {
  setModalColorPicker: React.Dispatch<React.SetStateAction<boolean>>
  // colors: ColorsReducer
  colorsDispatch: React.Dispatch<ColorsAction>
  color: Color
  // setColor: React.Dispatch<React.SetStateAction<Color>>
  type: string
}

interface Coordinates {
  x: number
  y: number
  mouseMoved: boolean
}

const formatSelectData = ['HEXADECIMAL', 'CMYK', 'HSB', 'HSL', 'LAB', 'RGB', 'XYZ']

export const ColorPicker = ({ setModalColorPicker, color, colorsDispatch, type }: ColorPickerProps) => {
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
  console.log(color);
  
  return (
    <Modal setModal={setModalColorPicker} backgroundOpacity={0}>
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
              <CloseModalButton setModal={setModalColorPicker} />
          </div>
        </dialog>
    </Modal>
  );
};