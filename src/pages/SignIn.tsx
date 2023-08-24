import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { openPopUp } from '../utils/openPopUp'

import { SignLayer } from '../containers/SignLayer'
import { Field, Form } from '../components/Form'

import { useAppDispatch } from '../app/hooks'
import { useSignInMutation, useSmSignInMutation } from '../features/auth/authApiSlice'
import { User, setCredentials } from '../features/auth/authSlice'

import '../styles/SignIn.css'

const fields: Field[] = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'your@email.com',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    placeholder: '******',
    required: true
  }
]
export const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [signIn, { isLoading }] = useSignInMutation()
  const [smSignIn] = useSmSignInMutation()
  const dispatch = useAppDispatch()

  const submit = async (data: Partial<User>) => {
    const user = await signIn(data).unwrap()

    dispatch(setCredentials({
      user: user,
      token: user.token,
      collectionModified: false
    }))

    navigate('/')
  }

  const messageListener = async(e: MessageEvent) => {
    if (e.data === 'error') {
      setLoading(false)
    }

    const key = e.data.length === 20 ? e.data : null

    console.log(e);
    if (key) {
      const user = await smSignIn(key).unwrap()

      dispatch(setCredentials({
        user: user.user,
        token: user.token,
        collectionModified: false
      }))

      navigate('/')
    }
  }

  const handleGoogleSignIn = () => {
    setLoading(true)

    openPopUp(
      // 'https://palette.onrender.com/api/v1/auth/google/callback',
      'http://localhost:3000/api/v1/auth/google/callback',
      'signin',
      messageListener
    )
  }

  const handleFacebookSignIn = () => {
    setLoading(true)

    openPopUp(
      // 'https://palette.onrender.com/api/v1/auth/facebook/callback',
      'http://localhost:3000/api/v1/auth/facebook/callback',
      'signin',
      messageListener
    )
  }

  const handleGithubSignIn = () => {
    setLoading(true)

    openPopUp(
      // 'https://palette.onrender.com/api/v1/auth/github/callback',
      'http://localhost:3000/api/v1/auth/github/callback',
      'signin',
      messageListener
    )
  }

  return (
    <SignLayer>
      { (isLoading || loading) && 
        <div className='loader-container'>
          <span className='loader' />
        </div>
      }

      <div className='main'>
        <Form fields={fields} submitEvent={submit} />

        <div className='Sign__footer'>
          <div className='Sign__options'>
            <h2 className='Sign__subtitle'>
              <span>Or Continue with</span>
            </h2>

            <div className='sign-options-container'>
              <button
                className='google-sign border-hover-primary'
                onClick={handleGoogleSignIn}
              >
                <span className='google-icon sm-icon' />
              </button>

              <button
                className='facebook-sign border-hover-primary'
                onClick={handleFacebookSignIn}
              >
                <span className='facebook-icon sm-icon' />
              </button>

              <button
                className='github-sign border-hover-primary'
                onClick={handleGithubSignIn}
              >
                <span className='github-icon sm-icon' />
              </button>
            </div>
          </div>

          <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </div>

      </div>
    </SignLayer>
  )
}
