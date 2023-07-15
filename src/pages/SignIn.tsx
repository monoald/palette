import React from 'react'
import { Link } from 'react-router-dom'

import { PrimaryButton } from '../components/buttons/PrimaryButton'
import { SignLayer } from '../containers/SignLayer'
import { Field, Form } from '../components/Form'

import '../styles/SignIn.css'
import { UserSignup, signin } from '../services/user'

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
  const submit = async (data: UserSignup) => {
    const user = await signin(data)
  }

  return (
    <SignLayer>
      <Form fields={fields} submitEvent={submit} />

      <div className='form-option'>
        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
      </div>
    </SignLayer>
  )
}
