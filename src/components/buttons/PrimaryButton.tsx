import React from 'react'

import '../../styles/PrimaryButton.css'

interface PrimaryButtonProps {
  event?: () => void
  content:  string
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'] | 'button'
}

export const PrimaryButton = ({ event, content, type }: PrimaryButtonProps) => {
  return (
    <button
      className='Primary-Button'
      onClick={event}
      type={type}
    >
      <div className='Primary-Button__content'>
        { content }
      </div>
    </button>
  )
}