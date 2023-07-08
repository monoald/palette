import React, { useState } from 'react'
import '../styles/Select.css'

interface Configuration {
  showCurrentValue: boolean
  showIcon: boolean
}

interface SelectProps {
  options: string[]
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  configuration: Configuration
}

export const Select = ({ options, value, setValue, configuration }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  function handleOpenSelect() {
    setIsOpen(!isOpen)
  }

  function handleSelect(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLButtonElement
    setValue(target.value)
    setIsOpen(!isOpen)
  }

  return (
    <div className='Select'>
      <button
        className='Select__toggle-button'
        onClick={handleOpenSelect}
        style={{
          position: 'relative'
        }}
      >
        { configuration.showCurrentValue && 
          <span className='current-value'>{value}</span>
        }
        { configuration.showIcon &&
          <span
            className='icon icon-arrow-down'
            style={{
              position: 'absolute',
              right: 0,
              top: 0
            }}
          ></span>
        }
      </button>
      {isOpen &&
        <div className='box' onClick={handleSelect} style={{ zIndex: 1 }}>
          {options.map(option => (
            <button key={option} className='box__option' value={option}>
              {option}
            </button>
          ))}
        </div>
      }
    </div>
  )
}
