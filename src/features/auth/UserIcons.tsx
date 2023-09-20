import { useAppSelector } from '../../app/hooks'
import { selectSavedIcons } from './authSlice'

import '../../styles/UserIcons.css'
import { useNavigate } from 'react-router-dom'

export const UserIcons = () => {
  const icons = useAppSelector(selectSavedIcons)
  const navigate = useNavigate()

  const handleGoToIcon = (id: string) => {
    navigate(`/edit-icons-collection/${id}`)
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
      </section>
    </>
  )
}
