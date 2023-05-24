import React from 'react'
import '../styles/Modal.css'

interface ModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  backgroundOpacity: number
  children: JSX.Element
}

export const Modal = ({ setModal, backgroundOpacity, children }: ModalProps) => {
  function closeModal(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLElement
    if (target.id === 'modal') {
      setModal(modal => !modal )
    }
  }
  return (
    <div
      className='Modal'
      id='modal'
      onMouseDownCapture={closeModal}
      style={{
        'backgroundColor': `rgba(0, 0, 0, ${backgroundOpacity})`
      }}
    >
      {children}
    </div>
  )
}