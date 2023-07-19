import { NavLink } from 'react-router-dom'
import '../../styles/ProfileNav.css'

export const ProfileNav = () => {
  return (
    <aside className='Profile-Nav'>
      <nav className='nav-container'>
        <ul className='nav'>
          <li className='nav__item txt-hover-secondary'>
            <NavLink
              to="/user/"
              className={({ isActive }) =>
                isActive ? "nav__button txt-secondary" : "nav__button"
              }
            >
              Palettes
            </NavLink>
          </li>

          <li className='nav__item txt-hover-secondary'>
          <NavLink
              to="/user/colors"
              className={({ isActive }) =>
                isActive ? "nav__button txt-primary" : "nav__button"
              }
            >
              Colors
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}