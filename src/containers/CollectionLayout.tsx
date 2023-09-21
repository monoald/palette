import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { ProfileNav } from '../components/navigators/ProfileNav'

import '../styles/CollectionLayout.css'

interface UserProfileProps {
  asideNavigation?: boolean
  children?: ReactNode
}

export const CollectionLayout = ({ asideNavigation = true, children }: UserProfileProps) => {
  return (
    <div className={ asideNavigation ? 'user-content' : 'collection-content' }>
      { asideNavigation && <ProfileNav /> }

      <main className='collection-layout__main'>
        { children
            ? children
            : <Outlet />
        }
      </main>
    </div>
  )
}