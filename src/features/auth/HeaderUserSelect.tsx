import { useNavigate } from 'react-router-dom'

import { useAppDispatch } from '../../app/hooks'
import { signOut } from './authSlice'

import '../../styles/HeaderUserSelect.css'

const HeaderUserSelect = () => {
  const navigation = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <ul className='user-select'>
      <li>
        <button
          className='user-select__option'
          onClick={() => navigation('/user/')}
        >
          My Palettes
        </button>
      </li>

      <li>
        <button
          className='user-select__option'
          onClick={() => navigation('/user/colors')}
        >
          My Colors
        </button>
      </li>

      <li>
        <button
          className='user-select__option'
          onClick={() => navigation('/user/gradients')}
        >
          My Gradients
        </button>
      </li>

      <li>
        <button
          className='user-select__option'
          onClick={() => dispatch(signOut())}
        >
          Sign Out
        </button>
      </li>
    </ul>
  )
}

export default HeaderUserSelect