import { Outlet } from 'react-router-dom'

import { Header } from '../../components/Header'
import { ProfileNav } from '../../components/navigators/ProfileNav'

import '../../styles/UserTab.css'

export const UserProfile = () => {
  return (
    <div className='User-Profile'>
      <Header />
        <div className='User-Profile__content'>
          <ProfileNav />

          <main className='User-Profile__main'>
            <Outlet />
          </main>
        </div>
    </div>
  )
}