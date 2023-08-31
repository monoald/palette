import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
// import useTheme from '../hooks/useTheme'

import { PrimaryButton } from './buttons/PrimaryButton'
import { SecondaryButton } from './buttons/SecondaryButton'

import { useAppSelector } from '../app/hooks'
import { selectUser } from '../features/auth/authSlice'
import HeaderUserSelect from '../features/auth/HeaderUserSelect'

import '../styles/Header.css'

export const Header = () => {
  const [toggleUserOptions, setToggleOptions] = useState(false)
  const user = useAppSelector(selectUser)
  
  const navigate = useNavigate()

  // const { theme, toggleTheme } = useTheme()

  return (
    <header className='Header'>
      <a href='/' className='logo'>
        Palette
      </a>

      <nav className='header-nav'>
        <ul className='header-nav__list'>
          <li className='header-nav__item'>
            <NavLink
              to='/palettes'
              className={({ isActive }) => 
                isActive ? 'nav-link--active' : 'nav-link'
              }
            >
              Palettes
            </NavLink>
          </li>

          <li className='header-nav__item'>
            <NavLink
              to='/colors'
              className={({ isActive }) => 
                isActive ? 'nav-link--active' : 'nav-link'
              }
            >
              Colors
            </NavLink>
          </li>

          <li className='header-nav__item'>
            <NavLink
              to='/'
              className={({ isActive }) => 
                isActive ? 'nav-link--active' : 'nav-link'
              }
            >
              Palette Generator
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <nav className='user-nav'>
        <ul className='user-nav__list'>
          {/* <li className='user-nav__item'>
            <button
              className='button-icon'
              onClick={toggleTheme}
              data-tooltip
            >
              <span className={`${theme === 'light' ? 'icon-sunny' : 'icon-moon'}`} />
              <DescriptionTooltip text='Change theme' tipPosition='bottom' />
            </button>
          </li> */}

          { user
            ? (
              <li className='user-nav__item'>
                <button
                  className='user-nav__avatar'
                  onClick={() => setToggleOptions(!toggleUserOptions)}
                >
                  <span
                    className={
                      user.avatar?.includes('http')
                        ? 'avatar'
                        : `avatar-icon avatar-${user.avatar}`
                    }
                    style={
                      user.avatar?.includes('http')
                        ? { backgroundImage: `url(${user.avatar})` }
                        : {}
                    }
                  />
                </button>

                { toggleUserOptions &&  <HeaderUserSelect />}
              </li>
            )
            : (
                <>
                  <li className='user-nav__item'>
                    <SecondaryButton event={() => navigate('/signup')} content='Sign Up' />
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
