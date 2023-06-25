/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'

import { OptionsAction } from '../reducers/options'
import { ModalsAction } from '../reducers/modals'
import { ColorsAction, History } from '../reducers/colors'

import '../styles/Header.css'

interface HeaderProps {
  optionsDispatch: React.Dispatch<OptionsAction>
  modalsDispatch: React.Dispatch<ModalsAction>
  colorsDispatch: React.Dispatch<ColorsAction>
  history: History
  setTooltipMessage: React.Dispatch<React.SetStateAction<string>>
}

export const Header = ({ optionsDispatch, modalsDispatch, colorsDispatch, history, setTooltipMessage }: HeaderProps) => {
  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setTooltipMessage('Url copied!')
  }

  return (
    <header className='Header'>
      <div className='navigation'>
        <ul className='option-container'>
          <li>
            <button className='option' onClick={() => optionsDispatch({ type: 'option', payload: 'colorBlind'})}>
              <span className='icon icon-eye'/>
              COLOR BLIND SIMULATOR
            </button>
          </li>

          <li>
            <button className='option' onClick={() => optionsDispatch({ type: 'option', payload: 'paletteType'})}>
              <span className='icon icon-palette'/>
              PALETTE TYPE
            </button>
          </li>

          <li>
            <button className='option' onClick={() => modalsDispatch({ type: 'img-extractor' })}>
              <span className='icon icon-image'/>
              IMAGE COLOR EXTRACTOR
            </button>
          </li>

          <li>
            <button className='option' onClick={() => colorsDispatch({ type: 'back-palette' })} disabled={history.currentIndex === 0}>
              <span className='icon icon-undo'/>
            </button>
          </li>

          <li>
            <button className='option' onClick={() => colorsDispatch({ type: 'forward-palette' })} disabled={history.currentIndex === history.data.length - 1}>
              <span className='icon icon-redo'/>
            </button>
          </li>
          
          <li>
            <button className='option' onClick={handleShare} >
              <span className='icon icon-share'/>
            </button>
          </li>

          <li className='github-info'>
            <div className='icon-container'>
              <span className='github-icon' />
            </div>
            <a className='name' href='https://github.com/monoald/palette' target='_blank'>
              By @monoald
            </a>
          </li>
        </ul>
      </div>
      
    </header>
  )
}
