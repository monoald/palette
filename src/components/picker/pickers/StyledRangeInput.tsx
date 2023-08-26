import '../../../styles/RangeInputs.css'

export interface BackgroundColor {
  start: string
  end: string
}

interface RangeInputProps {
  min: number
  max: number
  value: number
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  isHue?: boolean
  thumbColor?: string
  backgroundColor?: string
  id: string
}

export function ColorInput({ min, max, value, onChange, isHue = false, thumbColor, backgroundColor, id }: RangeInputProps) {
  return (
    <input
      id={id}
      className={`range-input ${isHue ? 'hue' : 'color'}-input`}
      type='range'
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      style={{
        '--thumb-background': isHue ? `hsl(${value}, 100%, 50%)` : thumbColor,
        '--background-color': isHue ? '' : `-webkit-linear-gradient(left, ${backgroundColor}`
      } as React.CSSProperties}
    />
  )
}