import React from 'react'
import '../styles/Modal.css'
import { ModalsAction, ModalsTypes } from '../reducers/modals'

interface ModalProps {
  modalsDispatch: React.Dispatch<ModalsAction>
  type: string
  backgroundOpacity: number
  children: JSX.Element
}

export const Modal = ({ modalsDispatch, type, backgroundOpacity, children }: ModalProps) => {
  function closeModal(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLElement
    if (target.id === 'modal') {
      modalsDispatch({ type: type as ModalsTypes })
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