import { useAppSelector } from '../../app/hooks'
import { selectSavedIcons } from './authSlice'

import '../../styles/UserIcons.css'
import { useNavigate } from 'react-router-dom'

export const UserIcons = () => {
  const icons = useAppSelector(selectSavedIcons)
  const navigate = useNavigate()

  const handleGoToIcon = (id: string) => {
    navigate(`/icons/edit/${id}`)
  }
  return (
    <>
      <section className='user-icons'>
        <ul className='items__list'>
          { icons && icons.map(icon => (
            <button
              className='item'
              key={icon.name}
              onClick={() => handleGoToIcon(icon.id as string)}
            >
              <img className='item__thumbnail' src={icon.thumbnail} alt="" />

              <div className='item__footer'>
                <p>{icon.name}</p>
              </div>
            </button>
          ))
          }
        </ul>

        { icons && icons.length === 0 &&
          <div className='no-saved-items'>
            <p>You have no saved icon fonts!</p>

            <div className='buttons'>
              <button
                className='primary-button'
                onClick={() => navigate('/create-icons-collection')}
              >
                  Create icon font
              </button>
            </div>
          </div>
        }
      </section>
    </>
  )
}
