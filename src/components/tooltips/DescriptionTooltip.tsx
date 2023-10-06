import '../../styles/DescriptionTooltip.css'

interface DescriptionTooltipProps {
  text: string
  tipPosition: string
}

export const DescriptionTooltip = ({ text, tipPosition }: DescriptionTooltipProps) => {
  return (
    <div id='tool-tip' role='tooltip' tip-position={tipPosition}>
      <span className='tool-tip__text'>{text}</span>
    </div>
  )
}
