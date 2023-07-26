import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '../components/Header'
import { ProfileNav } from '../components/navigators/ProfileNav'

import '../styles/CollectionLayout.css'

interface UserProfileProps {
  asideNavigation?: boolean
  children?: ReactNode
}

export const CollectionLayout = ({ asideNavigation = true, children }: UserProfileProps) => {
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