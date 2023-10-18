import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { openPopUp } from '../utils/openPopUp'

import { SignLayer } from '../containers/SignLayer'
import { Field, Form } from '../components/Form'

import { useAppDispatch } from '../app/hooks'
import { useSignInMutation, useSmSignInMutation } from '../features/auth/authApiSlice'
import { User, setCredentials, setSavedColors, setSavedGradientAnimations, setSavedGradients, setSavedIcons, setSavedPalettes } from '../features/auth/authSlice'
import { Color } from '../features/colors/colorsSlice'
import { Palette } from '../features/palettes/palettesSlice'
import { Gradient } from '../features/gradient/gradientsSlice'
import { GradientAnimation } from '../features/gradientAnimations/gradientAnimationsSlice'
import { IconCollection } from '../features/icons/iconsSlice'

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
  const [tooltip, setTooltip] = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()

  const [signIn, { isLoading }] = useSignInMutation()
  const [smSignIn] = useSmSignInMutation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (state) {
      if (state['user-created'] === true) {
        setTooltip(true)
  
        setTimeout(() => {
          setTooltip(false)
        }, 2000);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async (data: Partial<User>) => {
    const user = await signIn(data).unwrap()

    dispatch(setCredentials({
      user: user.user,
      token: user.token
    }))

    navigate('/')
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

      dispatch(setSavedColors(user.user.colors as Partial<Color>[]))
      dispatch(setSavedPalettes(user.user.palettes as Partial<Palette>[]))
      dispatch(setSavedGradients(user.user.gradients as Partial<Gradient>[]))
      dispatch(setSavedGradientAnimations(user.user['gradient-animations'] as Partial<GradientAnimation>[]))
      dispatch(setSavedIcons(user.user.icons as Partial<IconCollection>[]))

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
    <>
      { tooltip &&
        <div className='sign-modal'>
          <div className='sign-modal__container'>
            <p>User created successfully !</p>
            <span className='icon-rounded-check'/>
          </div>
        </div>
      }
      <SignLayer>
        { (isLoading || loading) && 
          <div className='loader-container'>
            <span className='loader' />
          </div>
        }

        <div className='main'>
          <Form fields={fields} submitEvent={submit} submitText='Sign In' />
        </div>

        <div className='Sign__footer'>
          <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>

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
    </>
  )
}
