import { NavLink, useNavigate } from 'react-router-dom'
// import useTheme from '../hooks/useTheme'

import { PrimaryButton } from './buttons/PrimaryButton'
import { SecondaryButton } from './buttons/SecondaryButton'

import { useAppSelector } from '../app/hooks'
import { selectUser } from '../features/auth/authSlice'
import HeaderUserSelect from '../features/auth/HeaderUserSelect'

import '../styles/Header.css'

export const Header = () => {
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
          <li className='header-nav__item item-palettes'>
            Palettes
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
            Colors
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
            Gradients
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
            Icon Fonts
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
      </nav>
      
      <nav className='user-nav'>
        <ul className='user-nav__list'>
          { user
            ? (
              <li className='user-nav__item'>
                <button
                  className='user-nav__avatar'
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

                <HeaderUserSelect />
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