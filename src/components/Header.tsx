import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from './buttons/PrimaryButton'
import { SecondaryButton } from './buttons/SecondaryButton'

import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../features/auth/authSlice'

import '../styles/Header.css'

export const Header = () => {
  const user = useAppSelector(selectCurrentUser)
  const navigate = useNavigate()

  return (
    <header className='Header'>
      <a href="/" className='logo txt-primary'>
        Palette
      </a>
      
      <nav className='user-nav'>
        <ul className='user-nav__list'>
          { user
            ? (
              <li className='user-nav__item'>
                <button className='user-nav__avatar'>
                  <span className='avatar-icon' style={{
                    backgroundImage: `url(${user.avatar})`
                  }} />
                </button>
              </li>
            )
            : (
                <>
                  <li className='user-nav__item'>
                    <SecondaryButton event={() => navigate('/')} content='Sign Up' />
                  </li>
                  <li className='user-nav__item'>
                    <PrimaryButton event={() => navigate('/signin')} content='Sign In' />
                  </li>
                </>
            )
          }
        </ul>
      </nav>
    </header>
  )
}
