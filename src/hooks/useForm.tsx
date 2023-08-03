import React, { useState } from 'react'
import { FormFields, formFields } from '../data/formFields'
import { isFetchBaseQueryError } from '../utils/isFetchBaseQueryError'
import { User } from '../features/auth/authSlice'

type Callback = (data: Partial<User>) => void

type ErrorType = 'format' | 'invalid'

export const useForm = () => {
  const [data, setData] = useState<Partial<User>>({} as Partial<User>)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<ErrorType | null>(null)

  const invalidField = (errorMessage: string, target?: HTMLElement) => {
    setErrorMessage(errorMessage)
    target?.classList.add('Form__input--invalid')
  }

  const validator = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const type = target.id as keyof FormFields
    const value = target.value.trim()

    // Validator
    for (const input of formFields[type]) {
      if (!input.regEx.test(value)) {
        setErrorType('format')
        invalidField(input.errorMessage, target)
        break
      }
      
      target.classList.remove('Form__input--invalid')
      setErrorMessage(null)
      setErrorType(null)
      setData(newData => {
        newData[type] = value
        return newData
      })
    }
  }

  const handleSubmit = (callback: Callback, form: React.RefObject<HTMLFormElement>) => {
    return async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (errorType === 'format') return

      try {
        await callback(data)

        form.current?.reset()
        setData({} as Partial<User>)
      } catch (error) {
        
        if (isFetchBaseQueryError(error)) {
          setErrorType('invalid')
          setErrorMessage((error.data as { message: string })?.message)
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
