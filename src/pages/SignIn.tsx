import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { SignLayer } from '../containers/SignLayer'
import { Field, Form } from '../components/Form'

import '../styles/SignIn.css'
import { UserSignup } from '../services/user'
import { useLoginMutation } from '../features/auth/authApiSlice'
import { useAppDispatch } from '../app/hooks'
import { setCredentials } from '../features/auth/authSlice'

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
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const submit = async (data: UserSignup) => {
    const user = await login(data).unwrap()

    dispatch(setCredentials({
      user: data,
      token: user.token,
    }))

    navigate('/user/')
  }

  return (
    <SignLayer>
      <Form fields={fields} submitEvent={submit} />

      <div className='Sign__footer'>
        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
      </div>
    </SignLayer>
  )
}
