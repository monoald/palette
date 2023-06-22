import React from 'react'

import '../styles/Tooltip.css'

interface TooltipProps {
  message: string
}

const Tooltip = ({ message }: TooltipProps) => {
  return (
    <div className={`Tooltip Tooltip${message !== '' ? '--active': ''}`}>
      <p className='message'>
        {message}
      </p>
    </div>
  )
}

export default Tooltip