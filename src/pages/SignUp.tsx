import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { openPopUp } from '../utils/openPopUp'

import { Field, Form } from '../components/Form'
import { SignLayer } from '../containers/SignLayer'

import { useAppDispatch } from '../app/hooks'
import { useSignUpMutation, useSmSignInMutation } from '../features/auth/authApiSlice'
import { User, setCredentials } from '../features/auth/authSlice'

import '../styles/SignIn.css'

const fileds: Field[] = [
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

export const SignUp = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [signUp, { isLoading }] = useSignUpMutation()
  const [smSignIn] = useSmSignInMutation()
  const dispatch = useAppDispatch()

  const submit = async (data: Partial<User>) => {
    await signUp(data).unwrap()

    navigate('/signin', { state: { 'user-created': true } })
  }

  const messageListener = async(e: MessageEvent) => {
    if (e.data === 'error') {
      setLoading(false)
    }

    const key = e.data.length === 20 ? e.data : null

    if (key) {
      const user = await smSignIn(key).unwrap()

      dispatch(setCredentials({
        user: user.user,
        token: user.token
      }))

      navigate('/')
    }
  }

  const handleGoogleSignIn = () => {
    setLoading(true)

    openPopUp(
      'https://extinct-houndstooth-fly.cyclic.cloud/api/v1/auth/google/callback',
      'signin',
      messageListener
    )
  }

  const handleFacebookSignIn = () => {
    setLoading(true)

    openPopUp(
      'https://extinct-houndstooth-fly.cyclic.cloud/api/v1/auth/facebook/callback',
      'signin',
      messageListener
    )
  }

  const handleGithubSignIn = () => {
    setLoading(true)

    openPopUp(
      'https://extinct-houndstooth-fly.cyclic.cloud/api/v1/auth/github/callback',
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
        <Form fields={fileds} submitEvent={submit} submitText='Sign Up' />
      </div>

        <div className='Sign__footer'>
          <p>Already on Palette? <Link to='/signin'>Sign in</Link></p>
          <div className='Sign__options'>
            <h2 className='Sign__subtitle'>
              <span>Or Continue with</span>
            </h2>

            <div className='sign-options-container'>
              <button
                className='google-sign'
                onClick={handleGoogleSignIn}
              >
                <span className='google-icon sm-icon' />
              </button>

              <button
                className='facebook-sign'
                onClick={handleFacebookSignIn}
              >
                <span className='facebook-icon sm-icon' />
              </button>

              <button
                className='github-sign'
                onClick={handleGithubSignIn}
              >
                <span className='github-icon sm-icon' />
              </button>
            </div>
          </div>
        </div>
    </SignLayer>
  )
}
