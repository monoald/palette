import { useNavigate } from 'react-router-dom'
import '../../styles/HeaderUserSelect.css'
import { useAppDispatch } from '../../app/hooks'
import { signOut } from './authSlice'

const HeaderUserSelect = () => {
  const navigation = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <div className='user-select'>
      <button
        className='user-select__option txt-primary'
        onClick={() => navigation('/user')}
      >
        Collections
      </button>

      <button
        className='user-select__option txt-primary'
        onClick={() => dispatch(signOut())}
      >
        Sign Out
      </button>
    </div>
  )
}

export default HeaderUserSelect