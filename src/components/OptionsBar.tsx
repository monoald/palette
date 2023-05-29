import React from 'react'
import '../styles/OptionsBar.css'

interface OptionsBarProps {
  options: string[]
  currentOption: string
  setCurrentOption: React.Dispatch<React.SetStateAction<string>>
  setOptionsBar: React.Dispatch<React.SetStateAction<string>>
}

export const OptionsBar = ({ options, currentOption, setCurrentOption, setOptionsBar }: OptionsBarProps) => {
  function handleClick(option: string) {
    setCurrentOption(option)
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
        onClick={() => setOptionsBar('none')}
      >
        CLOSE
      </button>
    </aside>
  )
}
