import React, { useState } from 'react'
import { AxiosError } from 'axios'
import { UserSignup } from '../services/user'
import { formFields } from '../data/formFields'

type Callback = (data: UserSignup) => void

interface Elements {
  [key: string]: HTMLElement | null
}

export const useForm = () => {
  const [element, setElement] = useState<Elements>({
    email: null
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [data, setData] = useState<UserSignup>({
    email: '',
    username: '',
    password: '',
  })

  const invalidField = (target: HTMLElement, type: keyof UserSignup, errorMessage: string) => {
    target.classList.add('Form__input--invalid')
    setErrorMessage(errorMessage)
    setData(newData => {
      newData[type] = ''
      return newData
    })
  }

  const validator = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const type = target.id as keyof UserSignup
    const value = target.value.trim()

    // Save input element
    if (!element[type]) setElement({ ...element, [type]: target})

    // Validator
    for (const input of formFields[type]) {
      if (!input.regEx.test(value)) {
        invalidField(target, type, input.errorMessage)
        break
      }
      
      target.classList.remove('Form__input--invalid')
      setErrorMessage(null)
      setData(newData => {
        newData[type] = value
        return newData
      })
    }
  }

  const handleSubmit = (callback: Callback) => {
    return async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      for (const item of Object.keys(data)) {
        if (data[item as keyof UserSignup] === '') return
      }

      try {
        await callback(data)
      } catch (error) {
        if (error instanceof AxiosError) {
          let inputError = ''

          if (error.response?.data.message.toLowerCase().includes('email')) {
            inputError = 'email'
          } else if (error.response?.data.message.toLowerCase().includes('username')) {
            inputError = 'username'
          } else if (error.response?.data.message.toLowerCase().includes('password')) {
            inputError = 'password'
          }
          const currentElement = element[inputError] as HTMLElement
          const errorMessage = error.response?.data.message as string

          invalidField(
            currentElement,
            inputError as keyof UserSignup, errorMessage)
        }
      }
    }
  }

  const handleValidator = (required: boolean) => {
    return {
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => validator(event),
      required
    }
  }

  return { handleValidator, handleSubmit, invalidField, errorMessage }
}
