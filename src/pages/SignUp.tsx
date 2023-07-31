import React from 'react'
import { Link } from 'react-router-dom'
import { UserSignup, signup } from '../services/user'

import { Field, Form } from '../components/Form'
import { SignLayer } from '../containers/SignLayer'

import '../styles/SignIn.css'

const fileds: Field[] = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'your@email.com',
    required: true
  },
  {
    name: 'username',
    type: 'text',
    placeholder: 'MrPalette',
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
  const submit = async (data: UserSignup) => {
    await signup(data)
  }

  const handleGoogleSignIn = () => {
    const win: Window = window;
    win.location = 'http://localhost:3000/api/v1/auth/google/callback'
  }

  return (
    <SignLayer>

      <div>
        <Form fields={fileds} submitEvent={submit} />

        <div className='Sign__footer'>
          <div className='Sign__options'>
            <h2 className='Sign__subtitle'>
              <span>Or Continue with</span>
            </h2>
            <button
              className='google-sign border-hover-primary'
              onClick={handleGoogleSignIn}
            >
              <span className='google-icon' />
            </button>
          </div>

          <p>Already on Palette? <Link to='/signin'>Sign in</Link></p>
        </div>
      </div>
    </SignLayer>
  )
}
