import React, { useState } from 'react'
import { OptionTypes, OptionsAction, OptionsReducer } from '../reducers/options'

import '../styles/OptionsBar.css'

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
      <button
        className='close-button'
        onClick={handleCloseBar}
      >
        <span className='close-button__icon icon-x'/>
      </button>

      <nav className='navigation'>
        <ul className='options-container'>
          {objectOptions.map(option => (
            <li
              key={option}
              className={`
                option
                ${options[type as keyof OptionsReducer] === option
                  ? 'option--active'
                  : ''
                }`
              }
              onClick={() => handleClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
