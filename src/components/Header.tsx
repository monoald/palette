import { NavLink, useNavigate } from 'react-router-dom'
// import useTheme from '../hooks/useTheme'
import { validateAvatar } from '../utils/validateAvatar'

import { useAppSelector } from '../app/hooks'
import { selectUser } from '../features/auth/authSlice'
import HeaderUserSelect from '../features/auth/HeaderUserSelect'

import '../styles/Header.css'
import { useState } from 'react'

export const Header = () => {
  const [toggleNav, setToggleNav] = useState(false)
  const user = useAppSelector(selectUser)
  
  const navigate = useNavigate()

  // const { theme, toggleTheme } = useTheme()

  return (
    <header className='Header'>
      <div className='header-content'>
        <p className='app-name'>
          <a href='/' className='logo'>
            Palette
          </a>
          by
          <a
            href='https://github.com/monoald'
            target='_blank'
            className='profile'
          >
            monoald
          </a>
        </p>

        <nav
          className={`
            header-nav
            ${toggleNav ? 'menu-fade-in' : 'menu-fade-out'}
          `}
        >
          <ul className='header-nav__list'>
            <li className='header-nav__item item-palettes'>
              <p>Palettes</p>
              <ul className='navigation'>
                <li>
                  <NavLink
                    to='/'
                    className={({ isActive }) => 
                      isActive ? 'nav-link--active' : 'nav-link'
                    }
                  >
                    Make palette
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/palettes'
                    className={({ isActive }) => 
                      isActive ? 'nav-link--active' : 'nav-link'
                    }
                  >
                    Explore palettes
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className='header-nav__item item-colors'>
              <p>Colors</p>
              <ul className='navigation'>
                <li>
                  <NavLink
                    to='/colors'
                    className={({ isActive }) => 
                      isActive ? 'nav-link--active' : 'nav-link'
                    }
                  >
                    Explore colors
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className='header-nav__item item-gradients'>
              <p>Gradients</p>
              <ul className='navigation'>
                <li>
                  <NavLink
                    to='/gradient'
                    className={({ isActive }) => 
                      isActive ? 'nav-link--active' : 'nav-link'
                    }
                  >
                    Make gradient
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/gradients'
                    className={({ isActive }) => 
                      isActive ? 'nav-link--active' : 'nav-link'
                    }
                  >
                    Explore gradients
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className='header-nav__item item-icons'>
              <p>Icon Fonts</p>
              <ul className='navigation'>
                <li>
                  <NavLink
                    to='/icons/create'
                    className={({ isActive }) => 
                      isActive ? 'nav-link--active' : 'nav-link'
                    }
                  >
                    Make icon fonts
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>

          { !user &&
            <div className='menu-buttons-sign'>
              <button
                className='secondary-button'
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
              <button
                className='primary-button'
                onClick={() => navigate('/signin')}
              >
                Sign In
              </button>
            </div>
          }
        </nav>

        <div className='menu-container'>
          <nav className='user-nav'>
            <ul className='user-nav__list'>
              { user &&
                  <li className='user-nav__item'>
                    <button
                      className='user-nav__avatar'
                    >
                      <span
                        className={
                          !validateAvatar(user.avatar as string)
                            ? 'avatar'
                            : `avatar-icon avatar-${user.avatar}`
                        }
                        style={
                          !validateAvatar(user.avatar as string)
                            ? { backgroundImage: `url(data:image/png;base64,${user.avatar})` }
                            : {}
                        }
                      />
                    </button>

                    <HeaderUserSelect />
                  </li>
              }
            </ul>
          </nav>

          <button
            className='menu-button'
            onClick={() => setToggleNav(!toggleNav)}
          >
            <span className='icon-menu' />
          </button>
        </div>

      </div>
    </header>
  )
}