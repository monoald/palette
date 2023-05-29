import React from 'react'
import '../styles/OptionsBar.css'

interface OptionsBarProps {
  options: string[]
  currentOption: string
  setCurrentOption: React.Dispatch<React.SetStateAction<string>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setHeightColorBlind: React.Dispatch<React.SetStateAction<number>>
}

export const OptionsBar = ({ options, currentOption, setCurrentOption, setOpen, setHeightColorBlind }: OptionsBarProps) => {
  function handleClick(option: string) {
    setCurrentOption(option)
    setHeightColorBlind(height => {
      if (height === 0) {
        return 280
      } else {
        return height
      }
    })
  }

  return (
    <aside className='OptionsBar'>
      <nav className='navigation'>
        <ul className='options-container'>
          {options.map(option => (
            <li
              className={`option${currentOption === option ? ' option--active' : ''}`}
              onClick={() => handleClick(option)}
            >
              <p>{option}</p>
              {currentOption === option &&
                <span className='icon icon-rounded-check' />
              }
            </li>
          ))}
        </ul>
      </nav>

      <button
        className='close-button'
        onClick={() => setOpen(state => !state)}
      >
        CLOSE
      </button>
    </aside>
  )
}
