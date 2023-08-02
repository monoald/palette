import { useNavigate } from 'react-router-dom'

import { useAppDispatch } from '../../app/hooks'
import { signOut } from './authSlice'

import '../../styles/HeaderUserSelect.css'

const HeaderUserSelect = () => {
  const navigation = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <ul className='user-select'>
      <div className='user-select__mask'>
        <li>
          <button
            className='user-select__option txt-primary'
            onClick={() => navigation('/user/')}
          >
            My Palettes
          </button>
        </li>

        <li>
          <button
            className='user-select__option txt-primary'
            onClick={() => navigation('/user/colors')}
          >
            My Colors
          </button>
        </li>

        <li>
          <button
            className='user-select__option txt-primary'
            onClick={() => dispatch(signOut())}
          >
            Sign Out
          </button>
        </li>
      </div>
    </ul>
  )
}

export default HeaderUserSelect