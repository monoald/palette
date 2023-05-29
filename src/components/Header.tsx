import React from 'react'
import '../styles/Header.css'

interface HeaderProps {
  setOpenColorBlind: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header = ({ setOpenColorBlind }: HeaderProps) => {
  return (
    <header className='Header'>
      <nav className='navigation'>
        <ul className='option-container'>
          <li className='option'
            onClick={() => setOpenColorBlind(state => !state)}
          >
            <span className='icon icon-eye'/>
            COLOR BLIND SIMULATOR
          </li>
          <li className='option'>
            <span className='icon icon-image'/>
            IMAGE COLOR EXTRACTOR
          </li>
        </ul>
      </nav>
      
    </header>
  )
}
