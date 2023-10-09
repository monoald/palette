/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useSave } from '../hooks/useSave'
import { useCheckSavedPalettes } from '../hooks/useCheckSavedPalette'

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
  setTooltipMessage: React.Dispatch<React.SetStateAction<string>>,
  paletteType: string
}

export const SideBar = ({ optionsDispatch, modalsDispatch, colorsDispatch, history, setTooltipMessage, paletteType }: HeaderProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setTooltipMessage('Url copied!')
  }
  const [isSaved, savedId] = useCheckSavedPalettes(history)
  const saveHandler = useSave(setTooltipMessage, { new: true })

  return (
    <aside className='SideBar'>
      <ul className='SideBar__nav'>
      <li>
          <button
            className='option'
            onClick={() => optionsDispatch({ type: 'option', payload: 'paletteType'})}
            data-tooltip
          >
            <DescriptionTooltip text='Palete type' tipPosition='right'/>
            <span className='option__icon icon-palette'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => optionsDispatch({ type: 'option', payload: 'colorBlind'})}
            data-tooltip
          >
            <DescriptionTooltip text='Color blind simulator' tipPosition='right'/>
            <span className='option__icon icon-eye'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => modalsDispatch({ type: 'img-extractor' })}
            data-tooltip
          >
            <DescriptionTooltip text='Extract palette from image' tipPosition='right'/>
            <span className='option__icon icon-image'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => colorsDispatch({ type: 'set-colors', payload: { paletteType } })}
            data-tooltip
          >
            <DescriptionTooltip text='Change palette (Spacebar)' tipPosition='right'/>
            <span className='option__icon icon-plus'/>
          </button>
        </li>

        <li>
          <button
            className='option'
            onClick={() => colorsDispatch({ type: 'back-palette' })}
            disabled={history.currentIndex === 0}
            data-tooltip
          >
            <DescriptionTooltip text='Undo' tipPosition='right'/>
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
            <DescriptionTooltip text='Redo' tipPosition='right'/>
            <span className='option__icon icon-redo'/>
          </button>
        </li>

        <li>
          <button
            className='option palette-like'
            onClick={saveHandler}
            data-tooltip
            data-colors={history.data[history.currentIndex]}
            data-saved={isSaved}
            data-id={savedId}
          >
            <DescriptionTooltip text='Save palette' tipPosition='right'/>
            <span
              className={`
                option__icon icon
                icon-heart${isSaved ? '-filled' : ''}
              `}
            />
          </button>
        </li>
        
        <li>
          <button
            className='option'
            onClick={handleShare}
            data-tooltip
          >
            <DescriptionTooltip text='Share palette' tipPosition='right'/>
            <span className='option__icon icon-share'/>
          </button>
        </li>
      </ul>
    </aside>
  )
}
