/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { AnyFormat, BaseColor, Cmyk, Hsl, Hsv, Lab, Rgb, Xyz } from '../../lib/types';
import { colorFormatConverter } from '../../lib';
import { Modal } from '../Modal';
import { Select } from '../Select';
import { CmykPicker, HexadecimalPicker, HsbPicker, HslPicker, PickerContainer, RgbPicker } from '../Pickers';
import { drawColorCanvas } from '../../utils/drawColorCanvas';
import { findColorCoordinates } from '../../utils/findColorCoordinates';
import { getMainContrastColor } from '../../utils/getMainContrastColor';
import '../../styles/ColorPicker.css'
import { Canvas } from './Canvas';
import { Color } from '../../pages/PaletteGenerator';
import { CloseModalButton } from '../CloseModalButton';
import { LabPicker } from '../Pickers/LabPicker';
import { XyzPicker } from '../Pickers/XyzPicker';
import colorBlind from '../../lib/colorBlind';


interface ColorPickerProps {
  setModalColorPicker: React.Dispatch<React.SetStateAction<boolean>>
  color: Color
  setColor: React.Dispatch<React.SetStateAction<Color>>
}

interface Coordinates {
  x: number
  y: number
  mouseMoved: boolean
}

const formatSelectData = ['HEXADECIMAL', 'CMYK', 'HSB', 'HSL', 'LAB', 'RGB', 'XYZ']

export const ColorPicker = ({ setModalColorPicker, color, setColor }: ColorPickerProps) => {
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
    const hex = format === 'hex' ? color as string : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['hex'] }).hex as string
    const cmyk = format === 'cmyk' ? color as Cmyk : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['cmyk'] }).cmyk as Cmyk
    const hsb = format === 'hsb' ? color as Hsv : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['hsv'] }).hsv as Hsv
    const hsl = format === 'hsl' ? color as Hsl : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['hsl'] }).hsl as Hsl
    const lab = format === 'lab' ? color as Lab : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['lab'] }).lab as Lab
    const rgb = format === 'rgb' ? color as Rgb : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['rgb'] }).rgb as Rgb
    const xyz = format === 'xyz' ? color as Xyz : colorFormatConverter(color as BaseColor, { identifyFormat: true, targetFormat: ['xyz'] }).xyz as Xyz

    const mainContrastColor = getMainContrastColor(hex)

    setColor((clr: Color) => ({
      color: hex,
      isLocked: clr.isLocked,
      id: clr.id,
      contrastColor: mainContrastColor,
      formats: {
        cmyk: cmyk,
        hsb: hsb,
        hsl: hsl,
        lab: lab,
        rgb: rgb,
        xyz: xyz,
      },
      colorBlind: {
        achromatomaly: colorBlind.toAchromatomaly(hex) as string,
        achromatopsia: colorBlind.toAchromatopsia(hex) as string,
        deuteranomaly: colorBlind.toDeuteranomaly(hex) as string,
        deuteranopia: colorBlind.toDeuteranopia(hex) as string,
        protanomaly: colorBlind.toProtanomaly(hex) as string,
        protanopia: colorBlind.toProtanopia(hex) as string,
        tritanomaly: colorBlind.toTritanomaly(hex) as string,
        tritanopia: colorBlind.toTritanopia(hex) as string
      }
    }))

    setMoveThumb(moveThumb)
  }

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