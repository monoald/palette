import React, { useRef } from 'react'
import { useForm } from '../hooks/useForm'
import { PrimaryButton } from './buttons/PrimaryButton'
import '../styles/Form.css'
import { User } from '../features/auth/authSlice'

interface SignFormProps {
  fields: Field[]
  submitEvent: (data: Partial<User>) => void
}

export interface Field {
  name: string
  type: string
  placeholder: string
  required: boolean
}

export const Form = ({ fields, submitEvent }: SignFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { handleValidator, handleSubmit, errorMessage } = useForm()

  const submitHandler =  handleSubmit(submitEvent, formRef)
  return (
    <form className='Form' onSubmit={submitHandler} ref={formRef}>

      { fields.map(field => (
        <div className='Form__item' key={field.name}>
          <label className='Form__label' htmlFor='email'>
            {field.name}
          </label>

          <input
            id={field.name}
            className='Form__input'
            type={field.type}
            placeholder={field.placeholder}
            { ...handleValidator(field.required) }
          />
        </div>
      ))}

      <div className='error'>
        <p className='error__message'>{errorMessage}</p>
      </div>

      <PrimaryButton type='submit' content='Sign Up' />
    </form>
  )
}
