import { useEffect, useState } from 'react'

import '../styles/Hint.css'

interface HintProps {
  hints: string[]
}

export const Hint = ({ hints }: HintProps) => {
  const [display, setDisplay] = useState(true)
  const [currentHint, setCurrentHint] = useState<string | undefined>()

  useEffect(() => {
    if (display) {
      setCurrentHint(hints[Math.floor(Math.random() * (hints.length - 1 - 0 + 1) + 0)])
      setTimeout(() => {
        setDisplay(false)
      }, 6000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (display && currentHint) {
    return (
      <dialog className='hint'>
        <div className='hint__text'>
          <span className='hint__icon icon-hint' />
          <p dangerouslySetInnerHTML={{__html: currentHint }}></p>
        </div>
      </dialog>
    )
  }

  return <></>
}
