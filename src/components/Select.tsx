import React, { useState } from 'react'
import '../styles/Select.css'

interface Configuration {
  showCurrentValue: boolean
  showIcon: boolean
}

interface SelectProps {
  options: Options
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  configuration: Configuration
  additionalIcon?: string
}

export interface Options {
  [key: string]: string | null
}

export const Select = ({ options, value, setValue, configuration, additionalIcon }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  function handleOpenSelect() {
    setIsOpen(!isOpen)
  }

  function handleSelect(value: string) {
    setValue(value)
    setIsOpen(!isOpen)
  }

  return (
    <div className='Select'>
      <button
        className='Select__toggle-button'
        onClick={handleOpenSelect}
        style={{
          position: 'relative',
          gridTemplateColumns: configuration.showIcon ? '1fr 30px' : '1fr'
        }}
      >
        { configuration.showCurrentValue && 
          <p className='current-value'>
            { options[value] &&
              <span className={`icon ${options[value]}`} />
            }
            { additionalIcon &&
              <span className={`icon ${additionalIcon}`} />
            }
            <span>{value}</span>
          </p>
        }
        { configuration.showIcon &&
          <span
            className='icon-arrow icon-arrow-down'
          ></span>
        }
      </button>
      {isOpen &&
        <ul className='box' style={{ zIndex: 1 }}>
          <div className='box__mask'>
            {Object.keys(options).map(option => (
              <li className='box__item' key={option}>
                <button key={option} className='box__option' onClick={() => handleSelect(option)}>
                  {options[option] &&
                    <span className={`icon ${options[option]}`} />
                  }
                  <span
                    className='content'
                    style={{
                      textAlign: options[option] ? 'start' : 'center'
                    }}
                  >
                    {option}
                  </span>
                </button>
              </li>
            ))}
          </div>
        </ul>
      }
    </div>
  )
}
