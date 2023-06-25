import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { PaletteGenerator } from '../pages/PaletteGenerator'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PaletteGenerator />} />

        <Route path='/:palette' element={<PaletteGenerator />} />
      </Routes>
    </BrowserRouter>
  )
}
