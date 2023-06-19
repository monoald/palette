import React, { useState } from 'react'
import '../styles/OptionsBar.css'
import { OptionTypes, OptionsAction, OptionsReducer } from '../reducers/options'

interface OptionsBarProps {
  objectOptions: string[]
  type: OptionTypes
  options: OptionsReducer
  optionsDispatch: React.Dispatch<OptionsAction>
}

export const OptionsBar = ({ objectOptions, type, options, optionsDispatch }: OptionsBarProps) => {
  const [fade, setFade] = useState(true)
  
  
  function handleClick(option: string) {
    optionsDispatch({ type: type, payload: option})
  }

  function handleCloseBar() {
    setFade(false)
    setTimeout(() => {
      optionsDispatch({ type: 'option', payload: 'none'})
    }, 1000)
  }

  return (
    <aside className={`OptionsBar ${fade ? 'fade-in': 'fade-out'}`}>
      <nav className='navigation'>
        <ul className='options-container'>
          {objectOptions.map(option => (
            <li
              key={option}
              className={`option${options[type as keyof OptionsReducer] === option ? ' option--active' : ''}`}
              onClick={() => handleClick(option)}
            >
              <p>{option}</p>
              {options[type] === option &&
                <span className='icon icon-rounded-check' />
              }
            </li>
          ))}
        </ul>
      </nav>

      <button
        className='close-button'
        onClick={handleCloseBar}
      >
        CLOSE
      </button>
    </aside>
  )
}
