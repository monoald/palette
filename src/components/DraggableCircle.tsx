import React, { useEffect, useRef, useState } from 'react';
import '../styles/DraggableCircle.css';

interface Coordinates {
  x: number
  y: number
}

interface DraggableCircleProps {
  coordinates: Coordinates
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates | null>>
  currentColor: string
}

export const DraggableCircle = ({ coordinates, setCoordinates, currentColor }: DraggableCircleProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null)

  // 
  useEffect(() => {
    let parent: HTMLElement | null | undefined
    parent = circleRef.current?.parentElement
    while (parent?.id !== 'modal') {
      parent = parent?.parentElement
    }

    parent?.addEventListener('mousemove', handleMouseMove)
    parent?.addEventListener('mouseup', handleMouseUp)

    return () => {
      parent?.removeEventListener('mousemove', handleMouseMove)
      parent?.removeEventListener('mouseup', handleMouseUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  useEffect(() => {
    const canvas = circleRef.current?.parentElement
    
    canvas?.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      canvas?.removeEventListener('mousedown', handleMouseDown)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  function moveCircleToCurrentLocation(event: MouseEvent) {
    const target = circleRef.current as HTMLElement
    const parent = target.parentElement as HTMLElement
    const containerRect = parent.getBoundingClientRect();
    const newX = event.clientX - containerRect.left - target.clientWidth / 2;
    const newY = event.clientY - containerRect.top - target.clientHeight / 2;

    // Ensure the circle's center stays within the parent container bounds
    const x = Math.max(-target.clientWidth / 2, Math.min(newX, containerRect.width - target.clientWidth / 2));
    const y = Math.max(-target.clientHeight / 2, Math.min(newY, containerRect.height - target.clientHeight / 2));
    
    setCoordinates({ x, y });
  }
  

  const handleMouseDown = (event: MouseEvent) => {
    moveCircleToCurrentLocation(event)
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      moveCircleToCurrentLocation(event)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const parent = target.parentElement as HTMLElement
    const step = 1;
    const containerRect = parent.getBoundingClientRect();

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();

        
        const newPos = { ...coordinates };
        switch (e.key) {
          case 'ArrowUp':
            newPos.y -= step;
            break;
          case 'ArrowDown':
            newPos.y += step;
            break;
          case 'ArrowLeft':
            newPos.x -= step;
            break;
          case 'ArrowRight':
            newPos.x += step;
            break;
          default:
            break;
        }
        // Ensure the circle's center stays within the parent container bounds
        newPos.x = Math.max(-target.clientWidth / 2, Math.min(newPos.x, containerRect.width - target.clientWidth / 2));
        newPos.y = Math.max(-target.clientHeight / 2, Math.min(newPos.y, containerRect.height - target.clientHeight / 2));

        setCoordinates(newPos)
    }
  };

  return (
    <div
      className="circle"
      tabIndex={0}
      style={{
        left: `${coordinates.x}px`,
        top: `${coordinates.y}px`,
      }}
      onKeyDown={handleKeyDown}
      ref={circleRef}
    >
      <div 
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: currentColor,
          border: '1px solid rgba(232, 233, 243, 0.4)'
        }}
      ></div>
    </div>
  );
};