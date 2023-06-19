import { useEffect } from 'react'
// import { KeyboardKey } from 'enums/keyboardKey'

export const useKeyDown = (callback: (T?: unknown) => void, keys: string[]) => {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const wasAnyKeyPressed = keys.some((key) => event.code === key)
  
      if (wasAnyKeyPressed) {
        event.preventDefault()
        callback()
      }
    }
    
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [callback, keys])
}
