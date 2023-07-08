import React, { ReactNode, useEffect, useRef, useState } from 'react'

import '../styles/DraggableModal.css'

interface DraggableModalProps {
  nameClass: string
  children: ReactNode
}

interface Coordinates {
  x: number
  y: number
}

export const DraggableModal = ({ children, nameClass }: DraggableModalProps) => {
  const componentRef = useRef<HTMLDialogElement>(null);
  const [isDragging, setIsDragging] = useState(false)
  const [newCoordinates, setNewCoordinates] = useState<Coordinates>({
    x: 0,
    y: 0
  })

  useEffect(() => {
    if (componentRef.current !== null) {
      const resizeObserver = new ResizeObserver(() => {
        const component = componentRef.current as HTMLElement

        setNewCoordinates({
          x: (window.innerWidth - component.clientWidth) / 2,
          y: (window.innerHeight - component.clientHeight) / 2
        })
      });

      resizeObserver.observe(componentRef.current);
      return () => resizeObserver.disconnect(); // clean up 
    }
  }, [])
  

  function handleDraggStart(event: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
    const target = event.target as HTMLElement

    if (
      target.tagName == 'BUTTON' ||
      target.tagName == 'INPUT' ||
      target.tagName == 'CANVAS'
    ) return 
    // if (target.tagName == 'INPUT') return
      setIsDragging(true)
  }
  

  function handleDragg(event: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
    if (isDragging) {
      setNewCoordinates((prevPosition) => ({
        x: prevPosition.x + event.movementX,
        y: prevPosition.y + event.movementY,
      }));
    }
  }

  function handleDraggEnd() {
    setIsDragging(false)
  }
  return (
    <dialog
      className={`Draggable-Modal ${nameClass}`} open
      style={{
        top: `${newCoordinates?.y}px`,
        left: `${newCoordinates?.x}px`,
        opacity: componentRef.current ? 1 : 0
      }}
      ref={componentRef}
      onMouseDown={handleDraggStart}
      onMouseMove={handleDragg}
      onMouseUp={handleDraggEnd}
      onMouseLeave={handleDraggEnd}
    >
      {children}
    </dialog>
  )
}
