import { PickerColor } from '../ColorPicker'

interface XyzPickerProps {
  color?: PickerColor
}

export const XyzPicker = ({ color }: XyzPickerProps) => {
  return (
    <>
      <div className='value-container'>
        <div className='value'>
          <p>X</p>
          <div className='value__input'>
            <p>{color?.formats.xyz?.x}</p>
          </div>
        </div>

        <div className='value'>
          <p>Y</p>
          <div className='value__input'>
            <p>{color?.formats.xyz?.y}</p>
          </div>
        </div>

        <div className='value'>
          <p>Z</p>
          <div className='value__input'>
            <p>{color?.formats.xyz?.z}</p>
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
