/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'

import { DescriptionTooltip } from './tooltips/DescriptionTooltip'

import { OptionsAction } from '../reducers/options'
import { ModalsAction } from '../reducers/modals'
import { ColorsAction, History } from '../reducers/colors'

import '../styles/SideBar.css'

interface HeaderProps {
  optionsDispatch: React.Dispatch<OptionsAction>
  modalsDispatch: React.Dispatch<ModalsAction>
  colorsDispatch: React.Dispatch<ColorsAction>
  history: History
  setTooltipMessage: React.Dispatch<React.SetStateAction<string>>
}

export const SideBar = ({ optionsDispatch, modalsDispatch, colorsDispatch, history, setTooltipMessage }: HeaderProps) => {
  function handleShare() {
    navigator.clipboard.writeText(`https://app-palette.vercel.app/${history.data[history.currentIndex]}`)
    setTooltipMessage('Url copied!')
  }

  return (
    <aside className='SideBar'>
      <ul className='SideBar__nav'>
        <li>
          <button
            className='option'
            onClick={() => optionsDispatch({ type: 'option', payload: 'colorBlind'})}
            data-tooltip
          >
            <DescriptionTooltip text="Color blind simulator" tipPosition="right"/>
            <span className='option__icon icon-eye'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => optionsDispatch({ type: 'option', payload: 'paletteType'})}
            data-tooltip
          >
            <DescriptionTooltip text="Palete type" tipPosition="right"/>
            <span className='option__icon icon-palette'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => modalsDispatch({ type: 'img-extractor' })}
            data-tooltip
          >
            <DescriptionTooltip text="Extract palette from image" tipPosition="right"/>
            <span className='option__icon icon-image'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => colorsDispatch({ type: 'back-palette' })} disabled={history.currentIndex === 0}
            data-tooltip
          >
            <DescriptionTooltip text="Undo" tipPosition="right"/>
            <span className='option__icon icon-undo'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => colorsDispatch({ type: 'forward-palette' })}
            disabled={history.currentIndex === history.data.length - 1}
            data-tooltip
          >
            <DescriptionTooltip text="Redo" tipPosition="right"/>
            <span className='option__icon icon-redo'/>
          </button>
        </li>
        
        <li>
          <button
            className='option'
            onClick={handleShare}
            data-tooltip
          >
            <DescriptionTooltip text="Share palette" tipPosition="right"/>
            <span className='option__icon icon-share'/>
          </button>
        </li>

        {/* <li className='github-info'>
          <div className='icon-container'>
            <span className='github-icon' />
          </div>
          <a className='name' href='https://github.com/monoald/palette' target='_blank'>
            By @monoald
          </a>
        </li> */}
      </ul>
    </aside>
  )
}
