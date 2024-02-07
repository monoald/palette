import { useEffect, useRef, useState } from 'react'

export function useIntersect(callback: () => void): [React.RefObject<HTMLElement>] {
  const [isOnScreen, setIsOnScreen] = useState(false)

  const observerRef = useRef<IntersectionObserver>()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => 
      setIsOnScreen(entry.isIntersecting)
    )

    if (ref.current) {
      observerRef.current?.observe(ref.current)

      return () => {
        observerRef.current?.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (isOnScreen) {
      callback()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnScreen])

  return [ref]
}