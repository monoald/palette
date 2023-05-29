import React from 'react'
import '../styles/Header.css'

interface HeaderProps {
  setOptionsBar: React.Dispatch<React.SetStateAction<string>>
}

export const Header = ({ setOptionsBar }: HeaderProps) => {
  return (
    <header className='Header'>
      <nav className='navigation'>
        <ul className='option-container'>
          <li className='option'
            onClick={() => setOptionsBar('color-blind')}
          >
            <span className='icon icon-eye'/>
            COLOR BLIND SIMULATOR
          </li>

          <li className='option'
            onClick={() => setOptionsBar('palette-type')}
          >
            <span className='icon icon-palette'/>
            PALETTE TYPE
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
