/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '../components/Header'
import { ProfileNav } from '../components/navigators/ProfileNav'

import { useAppDispatch } from '../app/hooks'
import { useGetSavedQuery } from '../features/auth/authApiSlice'
import { setSavedColors, setSavedPalettes } from '../features/auth/authSlice'

import '../styles/CollectionLayout.css'

interface UserProfileProps {
  asideNavigation?: boolean
  children?: ReactNode
}

export const CollectionLayout = ({ asideNavigation = true, children }: UserProfileProps) => {
  const dispatch = useAppDispatch()
  const {
    data: savedItems,
    isSuccess
  } = useGetSavedQuery()

  useEffect(() => {
    if (isSuccess && savedItems.colors && savedItems.palettes) {
      dispatch(setSavedColors(savedItems.colors))
      dispatch(setSavedPalettes(savedItems.palettes))
    }
  }, [isSuccess])
  

  return (
    <div className='collection-layout'>
      <Header />
        <div className={ asideNavigation ? 'user-content' : 'collection-content' }>
          { asideNavigation && <ProfileNav /> }

          <main className='collection-layout__main'>
            { children
                ? children
                : <Outlet />
            }
          </main>
        </div>
    </div>
  )
}