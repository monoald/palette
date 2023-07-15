import React from 'react'
import { useForm } from '../hooks/useForm'
import { UserSignup } from '../services/user'
import { PrimaryButton } from './buttons/PrimaryButton'
import '../styles/Form.css'

interface SignFormProps {
  fields: Field[]
  submitEvent: (data: UserSignup) => void
}

export interface Field {
  name: string
  type: string
  placeholder: string
  required: boolean
}

export const Form = ({ fields, submitEvent }: SignFormProps) => {
  const { handleValidator, handleSubmit, errorMessage } = useForm()

  const submitHandler =  handleSubmit(submitEvent)
  return (
    <form className='Form' onSubmit={submitHandler}>
      <div className='error'>
        <p className='error__message'>{errorMessage}</p>
      </div>

      { fields.map(field => (
        <div className='Form__item' key={field.name}>
          <label className='Form__label' htmlFor="email">
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

      <PrimaryButton type='submit' content='Sign Up' />
    </form>
  )
}
