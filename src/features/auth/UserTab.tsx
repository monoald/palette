/* eslint-disable react-refresh/only-export-components */
import { Outlet, useOutletContext } from 'react-router-dom'
import { Header } from '../../components/Header'
import { ProfileNav } from '../../components/navigators/ProfileNav'

import '../../styles/UserTab.css'
import { useState } from 'react'
import { Select } from '../../components/Select'
import { lengthOptions } from '../../components/user/UserPalettes'

const shapesSelect = {
  horizontal: 'icon-rectangle-h',
  vertical: 'icon-rectangle-v',
  circle: 'icon-circle'
}

export const UserProfile = () => {
  const [shape, setShape] = useState('horizontal')
  const [length, setLength] = useState('all')

  return (
    <div className='User-Profile'>
      <Header />
        <div className='User-Profile__content'>
          <ProfileNav />

          <main className='User-Profile__main'>
            <ul className='config'>
              <li className='config__item'>
                <Select
                  options={shapesSelect}
                  value={shape}
                  setValue={setShape}
                  configuration={{
                    showCurrentValue: true,
                    showIcon: true
                  }}
                />
              </li>
              <li className='config__item'>
                <Select
                  options={{ ...lengthOptions, all: null }}
                  value={length}
                  setValue={setLength}
                  configuration={{
                    showCurrentValue: true,
                    showIcon: true
                  }}
                  additionalIcon='icon-hash'
                />
              </li>
            </ul>

            <Outlet context={{ shape, length }} />
          </main>
        </div>
    </div>
  )
}

type ContextType = { shape: string, length: string }

export function useShapeLength() {
  return useOutletContext<ContextType>()
}