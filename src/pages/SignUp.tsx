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
    const user = await signup(data)
  }

  return (
    <SignLayer>
      <Form fields={fileds} submitEvent={submit} />

      <div className='Sign__footer'>
        <p>Already on Palette? <Link to='/signin'>Sign in</Link></p>
      </div>
    </SignLayer>
  )
}
