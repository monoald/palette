import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from './buttons/PrimaryButton'
import { SecondaryButton } from './buttons/SecondaryButton'

import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../features/auth/authSlice'

import '../styles/Header.css'
import useTheme from '../hooks/useTheme'
import { DescriptionTooltip } from './tooltips/DescriptionTooltip'

export const Header = () => {
  const user = useAppSelector(selectCurrentUser)
  const navigate = useNavigate()

  const { theme, toggleTheme } = useTheme()

  return (
    <header className='Header'>
      <a href="/" className='logo txt-primary'>
        Palette
      </a>
      
      <nav className='user-nav'>
        <ul className='user-nav__list'>
          <li className='user-nav__item'>
            <button
              className='button-icon'
              onClick={toggleTheme}
              data-tooltip
            >
              <span className={`${theme === 'light' ? 'icon-sunny' : 'icon-moon'} txt-hover-primary`} />
              <DescriptionTooltip text='Change theme' tipPosition='bottom' />
            </button>
          </li>

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
