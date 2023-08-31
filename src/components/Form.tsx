import React, { useRef } from 'react'
import { useForm } from '../hooks/useForm'

import { User } from '../features/auth/authSlice'

import '../styles/Form.css'

interface SignFormProps {
  fields: Field[]
  submitEvent: (data: Partial<User>) => void
  submitText: string
}

export interface Field {
  name: string
  type: string
  placeholder: string
  required: boolean
}

export const Form = ({ fields, submitEvent, submitText }: SignFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { handleValidator, handleSubmit, errorMessage } = useForm()

  const submitHandler =  handleSubmit(submitEvent, formRef)
  return (
    <form className='Form' onSubmit={submitHandler} ref={formRef}>

      { fields.map(field => (
        <div className='Form__item' key={field.name}>
          <label className='Form__label' htmlFor={field.name}>
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

      <input className='primary-button' type='submit' value={submitText} />
    </form>
  )
}
