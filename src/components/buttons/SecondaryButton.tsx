import React from 'react'

import '../../styles/SecondaryButton.css'

interface SecondaryButtonProps {
  event: () => void
  content:  string
  className?: string
}

export const SecondaryButton = ({ event, content, className }: SecondaryButtonProps) => {
  return (
    <button
      className={`Secondary-Button border-hover-primary ${className}`}
      onClick={event}
    >
      <div className='Secondary-Button__content txt-hover-primary'>
      { content }
      </div>
    </button>
  )
}