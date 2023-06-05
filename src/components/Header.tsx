import React from 'react'

import { OptionsAction } from '../reducers/options'
import { ModalsAction } from '../reducers/modals'

import '../styles/Header.css'

interface HeaderProps {
  optionsDispatch: React.Dispatch<OptionsAction>
  modalsDispatch: React.Dispatch<ModalsAction>
}

export const Header = ({ optionsDispatch, modalsDispatch }: HeaderProps) => {
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
            onClick={() => modalsDispatch({ type: 'img-extractor' })}
          >
            <span className='icon icon-image'/>
            IMAGE COLOR EXTRACTOR
          </li>
        </ul>
      </nav>
      
    </header>
  )
}
