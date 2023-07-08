import React from 'react'

import '../../styles/SecondaryButton.css'

interface SecondaryButtonProps {
  event: () => void
  content:  string
}

export const SecondaryButton = ({ event, content }: SecondaryButtonProps) => {
  return (
    <button
      className='Secondary-Button border-hover-primary'
      onClick={event}
    >
      <div className='Secondary-Button__content txt-hover-primary'>
      { content }
      </div>
    </button>
  )
}