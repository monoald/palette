import '../../styles/Tooltip.css'

interface TooltipProps {
  message: string
}

const Tooltip = ({ message }: TooltipProps) => {
  return (
    <div className='tooltip-container'>
      <div className={`Tooltip Tooltip${message !== '' ? '--active': ''}`}>
        <p className='message'>
          {message}
        </p>
      </div>
    </div>
  )
}

export default Tooltip