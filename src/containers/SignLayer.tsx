import React, { ReactNode } from 'react'

import '../styles/SignLayer.css'

interface SignLayerProps {
  children: ReactNode
}

export const SignLayer = ({ children }: SignLayerProps) => {
  return (
    <main className='SignLayer'>
      <div className='SignLayer__container'>
        <div className='SignLayer__header'>
          <h1 className='logo txt-primary'>
            Palette
          </h1>
        </div>

        { children }
      </div>
    </main>
  )
}
