import React from "react"

interface CloseModalButtonProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const CloseModalButton = ({ setModal }: CloseModalButtonProps) => {
  return (
    <button
      className='close-button'
      onClick={() => setModal(modal => !modal)}
    >
      CLOSE
    </button>
  )
}