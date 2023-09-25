import { useNavigate } from 'react-router-dom'
import '../styles/404.css'

export const NotFound = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <main className='not-found'>

      <span className='not-found__404'/>

      <div className='not-found__main'>
        <div className='not-found__right'>
          <p className='not-found__text'>Sorry, we can`t find what you are looking for.</p>
          <button className='primary-button' onClick={handleBack}>
            Back
          </button>
        </div>

        <span className='not-found__face' />
      </div>

    </main>
  )
}