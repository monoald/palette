import React from "react"
import { ModalsAction, ModalsTypes } from "../reducers/modals"

interface CloseModalButtonProps {
  modalsDispatch: React.Dispatch<ModalsAction>
  type: string
}

export const CloseModalButton = ({ modalsDispatch, type }: CloseModalButtonProps) => {
  return (
    <button
      className='close-button'
      onClick={() => modalsDispatch({ type: type as ModalsTypes })}
    >
      CLOSE
    </button>
  )
}