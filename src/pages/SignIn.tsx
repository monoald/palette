import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { SignLayer } from '../containers/SignLayer'
import { Field, Form } from '../components/Form'

import { useAppDispatch } from '../app/hooks'
import { useSignInMutation } from '../features/auth/authApiSlice'
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
  const [signIn, { isLoading }] = useSignInMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const submit = async (data: Partial<User>) => {
    const user = await signIn(data).unwrap()

    dispatch(setCredentials({
      user: user,
      token: user.token,
      collectionModified: false
    }))

    navigate('/')
  }

  const handleGoogleSignIn = () => {
    const win: Window = window
    win.location = 'https://palette.onrender.com/api/v1/auth/google/callback'
  }

  const handleFacebookSignIn = () => {
    const win: Window = window
    win.location = 'https://palette.onrender.com/api/v1/auth/facebook/callback'
  }

  return (
    <SignLayer>

      { isLoading && 
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
                <span className='google-icon' />
              </button>

              <button
                className='facebook-sign border-hover-primary'
                onClick={handleFacebookSignIn}
              >
                <span className='facebook-icon' />
              </button>
            </div>
          </div>

          <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </div>

      </div>
    </SignLayer>
  )
}
