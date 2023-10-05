import { useEffect } from 'react'
import '../styles/Loader.css'
import { useNavigate } from 'react-router-dom'

const Loader = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const key = params.get('key')

    if (!window.opener) return navigate('/')

    if (window.opener && key) {
      window.opener.postMessage(key)
      window.close()
    } else {
      window.opener.postMessage('error')
      window.close()
    }
  }, [])

  return (
    <div className='loader-page'>
      <div className='loader-container'>
        <span className='loader' />
      </div>
    </div>
  )
}

export default Loader