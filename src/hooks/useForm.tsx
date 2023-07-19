import React, { useState } from 'react'
import { UserSignup } from '../services/user'
import { formFields } from '../data/formFields'
import { isFetchBaseQueryError } from '../utils/isFetchBaseQueryError'

type Callback = (data: UserSignup) => void

type ErrorType = 'format' | 'invalid'

export const useForm = () => {
  const [data, setData] = useState<UserSignup>({} as UserSignup)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<ErrorType | null>(null)

  const invalidField = (errorMessage: string, target?: HTMLElement) => {
    setErrorMessage(errorMessage)
    target?.classList.add('Form__input--invalid')
  }

  const validator = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const type = target.id as keyof UserSignup
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
        setData({} as UserSignup)
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          setErrorType('invalid')
          const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data)
          invalidField(errorMessage)
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
