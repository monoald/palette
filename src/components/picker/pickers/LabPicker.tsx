import { PickerColor } from '../ColorPicker'

interface LabPickerProps {
  color?: PickerColor
}

export const LabPicker = ({ color }: LabPickerProps) => {
  return (
    <>
      <div className='value-container'>
        <div className='value'>
          <p>L</p>
          <div className='value__input'>
            <p>{color?.formats.lab?.l}</p>
          </div>
        </div>

        <div className='value'>
          <p>A</p>
          <div className='value__input'>
            <p>{color?.formats.lab?.a}</p>
          </div>
        </div>

        <div className='value'>
          <p>B</p>
          <div className='value__input'>
            <p>{color?.formats.lab?.b}</p>
          </div>
        </div>
      </div>

      <div className='readonly-message'>
        <span className='icon icon-warning'/>
        <p>Read Only</p>
      </div>
    </>
  )
}