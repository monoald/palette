import React from 'react'
import '../styles/Header.css'
import { OptionsAction } from '../reducers/options'

interface HeaderProps {
  optionsDispatch: React.Dispatch<OptionsAction>
  setImageExtractor: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header = ({ optionsDispatch, setImageExtractor }: HeaderProps) => {
  return (
    <header className='Header'>
      <nav className='navigation'>
        <ul className='option-container'>
          <li className='option'
            onClick={() => optionsDispatch({ type: 'option', payload: 'colorBlind'})}
          >
            <span className='icon icon-eye'/>
            COLOR BLIND SIMULATOR
          </li>

          <li className='option'
            onClick={() => optionsDispatch({ type: 'option', payload: 'paletteType'})}
          >
            <span className='icon icon-palette'/>
            PALETTE TYPE
          </li>

          <li className='option'
            onClick={() => setImageExtractor(state => !state)}
          >
            <span className='icon icon-image'/>
            IMAGE COLOR EXTRACTOR
          </li>
        </ul>
      </nav>
      
    </header>
  )
}
